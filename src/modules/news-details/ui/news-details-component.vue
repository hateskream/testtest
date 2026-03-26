<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { formatNewsDate, NewsIconScore, useNewsPage } from '@/modules/news';
import { BaseErrorComponent } from '@/modules/widgets/base';
import { useQueryNewsDetails } from '../queries';
import type { IGetNewsDetailsResponse } from '../api';
import { RouteNames } from '@/types/route.d';
import { isFeatureEnabled } from '@/shared/lib';

import NewsDetailsSkeletonComponent from './details/news-details-skeleton-component.vue';
import NewsDetailsSourcesComponent from './details/news-details-sources-component.vue';
import NewsDetailsTickersComponent from './details/news-details-tickers-component.vue';

const props = defineProps<{
	displayVariant: 'new' | 'default';
	uuid: string;
	isLoading?: boolean;
}>();

const route = useRoute();

const { data, isLoading, isError, refetch } = useQueryNewsDetails(() => ({
	id: props.uuid,
}));

const newsDetails = computed<IGetNewsDetailsResponse | null>(() => {
	return data.value ?? null;
});

const time = computed(() => {
	if (!newsDetails.value) {
		return '';
	}

	return formatNewsDate(newsDetails.value.updated_at);
});

const { getPathString } = useNewsPage();

const isNewsPage = computed(
	() => route.name === RouteNames.News || route.name === RouteNames.NewsDetails,
);
</script>

<template>
	<div :class="classes.root">
		<news-details-skeleton-component v-if="isLoading || props.isLoading" />

		<base-error-component v-else-if="isError" @retry="refetch" />

		<article v-else-if="newsDetails" :class="classes.article">
			<header :class="classes.header">
				<div :class="classes.headerMain">
					<h2 :class="classes.title" class="title-300">
						{{newsDetails.primary_title}}
					</h2>

					<div :class="classes.meta">
						<span>{{ time }}</span>
						<span class="dot">·</span>
						<div :class="classes.scoreSentimentWrapper">
							<span :class="classes.score">
								<news-icon-score
									:score="newsDetails.sentiment.score"
									:tone="newsDetails.sentiment.tone"
								/>
							</span>
							<span :class="classes.sentiment">
								{{newsDetails.sentiment.score}} {{ newsDetails.sentiment.tone }}
							</span>
						</div>
					</div>
				</div>

				<aside :class="classes.sidebar">
					<div :class="classes.sidebarRow">
						<news-details-sources-component
							:sources="newsDetails.sources"
						/>

						<news-details-tickers-component
							v-if="newsDetails.tickers"
							:tickers="newsDetails.tickers"
							:display-variant
						/>
					</div>

					<section v-if="!isNewsPage && isFeatureEnabled('NEWS_PAGE_ENABLED')" :class="classes.redirectPage">
						<router-link
							:to="getPathString(newsDetails.id, newsDetails.slug, {memo: true})"
							:class="classes.link"
							class="text-200-r"
						>
							Details
						</router-link>
					</section>
				</aside>
			</header>

			<section v-if="newsDetails" :class="classes.content">
				{{newsDetails.summary}}
			</section>
		</article>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	container: details / inline-size;
	user-select: text;
}

.article {
	width: 100%;
	padding: 0 16px;
	overflow-y: auto;
}

.header {
	position: relative;
	display: block;
}

.title {
	color: #ffffff;
}

.meta {
	display: flex;
	align-items: center;
	margin: 8px 0;
	font-weight: 440;
	font-size: 12px;
	line-height: 1.7;
	color: var(--color-text-base-300, #9a9a9d);
	gap: 6px;
}

.dot {
	color: var(--color-text-base-300, #9a9a9d);
}

.scoreSentimentWrapper {
	display: flex;
	align-items: center;
	gap: var(--padding-padding-s2, 2px);
}

.score {
	position: relative;
	width: 22px;
	height: 22px;
}

.sentiment {
	text-transform: capitalize;
}

.sidebar {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 24px;
	user-select: none;
}

.sidebarRow {
	display: flex;
	justify-content: space-between;
	width: 100%;
	gap: var(--padding-s7, 12px) var(--padding-s12, 24px);
}

.link {
	margin-top: 12px;
	color: var(--text-color-base-100-effect);
	text-decoration: underline;
}

.link:hover {
	color: var(--text-color-base-100-activated);
}

.redirectPage {
	display: flex;
	align-items: flex-end;
	width: 100%;
	margin-top: auto;
}

.content {
	width: 100%;
	margin: 12px 0 21px;
	font-weight: 400;
	font-size: 15px;
	line-height: 1.6;
	color: #ffffff;
}

@container (max-width: 649px) {
	.sidebar {
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0;
		width: auto;
	}

	.redirectPage {
		width: 33%;
	}
}

@container (min-width: 650px) {
	.header,
	.content {
		padding-right: 324px;
	}

	.controls {
		display: none;
	}

	.sidebar {
		position: absolute;
		top: 0;
		right: 0;
		flex-direction: column;
		justify-content: space-between;
		width: 308px;
		height: 100%;
	}

	.content {
		margin-top: unset;
	}

	.meta {
		margin: 12px 0;
	}
}
</style>
