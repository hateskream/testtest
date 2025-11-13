<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { sourceToName, useNewsPage } from '@/modules/news';
import { tickerIcon } from '@/shared/ui/ticker';
import { BaseErrorComponent } from '@/modules/widgets/base';
import { useQueryNewsDetails } from '../queries';
import type { IGetNewsDetailsResponse } from '../api';
import { NewsIconScore } from '@/modules/news';
import { RouteNames } from '@/types/route.d';

import NewsDetailsSkeletonComponent from './details/news-details-skeleton-component.vue';

const props = defineProps<{
	uuid: string;
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
		return 'Date not find';
	}

	return new Date(newsDetails.value.date).toLocaleDateString('en-US', {
		day: '2-digit',
		month: 'short',
		hour12: true,
		hour: '2-digit',
		minute: '2-digit',
	});
});

const { getPathString } = useNewsPage();

const isNewsPage = computed(
	() => route.name === RouteNames.News || route.name === RouteNames.NewsDetails,
);
</script>

<template>
	<div :class="classes.root">
		<news-details-skeleton-component v-if="isLoading" />

		<base-error-component v-else-if="isError" @retry="refetch" />

		<article v-else-if="newsDetails" :class="classes.article">
			<header :class="classes.header">
				<div :class="classes.headerMain">
					<h2 :class="classes.title">
						{{newsDetails.title}}
					</h2>

					<div :class="classes.meta">
						<span>{{ time }}</span>
						<span class="dot">·</span>
						<span :class="classes.score">
							<news-icon-score :score="newsDetails.score" />
						</span>
						<span :class="classes.sentiment">{{ newsDetails.sentiment }}</span>
					</div>
				</div>

				<aside :class="classes.sidebar">
					<div :class="classes.sidebarRow">
						<section :class="classes.sources">
							<h3 :class="classes.subheading">Sources</h3>
							<ul :class="classes.sourceList">
								<li v-for="source in newsDetails.sources" :key="source">
									<a :href="source">{{ sourceToName[source] }}</a>
								</li>
							</ul>
							<span :class="classes.note">Summarised by i88</span>
						</section>

						<section :class="classes.tickers">
							<h3 :class="classes.subheading">Tickers</h3>
							<ul :class="classes.tickerList">
								<li v-for="ticker in newsDetails.stocks" :key="ticker.name">
									<div :class="classes.tickerItem">
										<ticker-icon
											:ticker="ticker.ticker"
											:src="ticker.srcImage"
											:size="12"
										/>
										<span :class="classes.tickerSymbol">{{ ticker.ticker }}</span>
										<span :class="classes.tickerChange">1.10%</span>
									</div>
								</li>
							</ul>
						</section>
					</div>

					<section v-if="!isNewsPage" :class="classes.redirectPage">
						<router-link
							:to="getPathString(newsDetails.id, newsDetails.slug, {memo: true})"
							:class="classes.link"
						>
							Details
						</router-link>
					</section>
				</aside>
			</header>

			<section v-if="newsDetails" :class="classes.content">
				{{newsDetails.article}}
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
	font-weight: 340;
	font-size: var(--typography-headers-size-h02, 24px);
	line-height: 1.5;
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
	justify-content: space-evenly;
	width: 100%;
}

.subheading {
	font-weight: 410;
	font-size: 18px;
	line-height: 1;
	color: #ffffff;
}

.sources,
.tickers {
	display: flex;
	flex-direction: column;
	gap: 6px;
	width: 100%;
}

.sourceList {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.sourceList a {
	font-weight: 440;
	font-size: 12px;
	line-height: 1.7;
	color: var(--color-text-base-300, #9a9a9d);
	text-decoration: underline dotted;
	text-underline-offset: 2px;
}

.note {
	font-weight: 440;
	font-size: 10px;
	line-height: 1.7;
	color: var(--color-text-base-100, #646568);
}

.tickerList {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.tickerItem {
	display: flex;
	align-items: center;
	width: max-content;
	padding: 2px 6px 2px 2px;
	background: var(--color-bg-base-300, rgb(37 37 39 / 50%));
	border-radius: 9999px;
	gap: 4px;
}

.tickerSymbol {
	font-weight: 440;
	font-size: 10px;
	color: var(--color-text-base-500, #ffffff);
}

.tickerChange {
	font-weight: 440;
	font-size: 10px;
	color: var(--color-metrics-positive-copy, #04eda0);
}

.link {
	margin-top: 12px;
	font-size: var(--typography-paragraph-size-p-01);
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
