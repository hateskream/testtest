<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiSkeleton } from '@/shared/ui/skeleton';
import { BaseErrorComponent } from '@/modules/widgets/base';
import {
	TickerBaseTabSection,
	TickerBaseTabSectionWrapper,
	TickerBaseTabSectionHead,
} from '@/modules/ticker/ui/base';
import { NewsDetails, NewsDetailsControls } from '@/modules/news-details';
import { getEndOfWeek, getStartOfWeek, toUtcIsoDate } from '../../model';
import { useQueryNews } from '../../queries';

import NewsContentWrapper from '../news-content-wrapper-component.vue';
import NewsListComponent from '../news-list-component.vue';

interface IWidgetComponentProps {
	meta: {
		tickerId: string;
	};
}

defineProps<IWidgetComponentProps>();

const selectedNewsId = ref<string | null>(null);

const { data, isLoading, isError, refetch } = useQueryNews({
	offset: 0,
	limit: 50,
	score: new Set(),
	segment: {
		selectedTickers: [],
		excludedTickers: [],
		selectedMarkets: [],
	},
	sentiment: new Set(),
	source: new Set(),
	activeSort: null,
	locations: [],
	dateFrom: toUtcIsoDate(getStartOfWeek(new Date())),
	dateTo: toUtcIsoDate(getEndOfWeek(new Date())),
});

const news = computed(() => {
	if (!data.value) {
		return [];
	}

	return data.value.pages.flatMap(page => page.data);
});
</script>

<template>
	<ticker-base-tab-section v-if="isLoading">
		<template #title>
			<ui-skeleton width="60px" height="22px" />
		</template>
		<template #content>
			<ui-skeleton
				v-for="key in 5"
				:key="key"
				width="100%"
				height="160px"
				border-radius="var(--radius-radius-s20-72, 28.4px)"
			/>
		</template>
	</ticker-base-tab-section>

	<ticker-base-tab-section v-else-if="isError">
		<template #title>News</template>
		<template #content>
			<div :class="classes.error">
				<base-error-component @retry="refetch()" />
			</div>
		</template>
	</ticker-base-tab-section>

	<ticker-base-tab-section-wrapper v-else>
		<ticker-base-tab-section-head>News</ticker-base-tab-section-head>
		<news-content-wrapper :state="!!selectedNewsId">
			<template #default>
				<news-list-component
					:class="classes.list"
					:news="news"
					:display-settings="{
						isShowDate: true,
						isShowSource: true,
						isShowDesc: true,
						isShowAuthor: true,
						isShowSymbols: true,
						isShowScore: true,
					}"
					:display-variant="'dashboard'"
					@wheel.capture.stop
					@select-news="selectedNewsId = $event.id"
				/>
			</template>

			<template #details v-if="selectedNewsId">
				<news-details-controls @back="selectedNewsId = null" />
				<news-details :uuid="selectedNewsId!" display-variant="new" />
			</template>
		</news-content-wrapper>
	</ticker-base-tab-section-wrapper>
</template>

<style module="classes">
.error {
	display: grid;
	width: 100%;
	height: 700px;
	place-items: center;
}

.list {
	max-height: 700px;
	overflow: scroll;
}
</style>
