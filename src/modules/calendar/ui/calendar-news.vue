<script setup lang="ts">
import { computed, ref } from 'vue';

import { type IGetNewsRequest, NewsFiltersPanel, NewsListComponent, useNews, useQueryNews } from '@/modules/news';

const {
	segments,
	selectedMarketSegments,
	selectedSegmentTickers,
	selectedSegmentRequest,

	resetAllChanges,
	selectAll,
	unselectAll,
	toggleTicker,

	selectedScores,
	selectedSentiment,
	selectedSources,
	displaySettings,
	locations,
	activeLocations,
	selectedTickers,
	sortBy,
	include,
	activeDateRange,
	dateRange,
} = useNews({
	widgetId: 'calendar-page-news',
	isEphemeral: false,
	defaultStateType: '',
});

const { data, fetchNextPage } = useQueryNews(computed<IGetNewsRequest>(() => ({
	offset: 0,
	score: selectedScores.value,
	segment: selectedSegmentRequest.value,
	sentiment: selectedSentiment.value,
	source: selectedSources.value,
	locations: activeLocations.value,
	activeSort: sortBy.value,
	selectedTickers: selectedTickers.value,
	limit: 10,
})));

const selectedNewsId = ref<string | null>(null);

function selectNews(id: string) {
	selectedNewsId.value = id;
}

const news = computed(() => data?.value?.pages.flatMap(page => page?.data).filter(t => !!t) ?? []);
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.title">News</div>
		<news-filters-panel
			v-model:selected-scores="selectedScores"
			v-model:selected-segments="selectedMarketSegments"
			v-model:selected-sentiment="selectedSentiment"
			v-model:selected-sources="selectedSources"
			v-model:locations="locations"
			v-model:sort-by="sortBy"
			v-model:include="include"
			v-model:active-date-range="activeDateRange"
			v-model:date-range="dateRange"
			display-variant="tv"
			:segments="segments"
			:selected-segments-tickers="selectedSegmentTickers"
			@select-all="selectAll"
			@unselect-all="unselectAll"
			@toggle-ticker="toggleTicker"
			@reset-all-changes="resetAllChanges"
		/>
		<news-list-component
			:news="news"
			:display-settings="displaySettings"
			display-variant="tv"
			@next="fetchNextPage"
			@select-news="selectNews($event.id)"
		/>
	</div>
</template>

<style module="classes">
/* TODO: use dynamic height */
.root {
	width: 100%;
	height: 50dvh;
	overflow: hidden;
}

.title {
	padding-left: 16px;
	overflow: hidden;
	font-style: normal;
	font-weight: 300;
	font-size: var(--font-title-100-size, 13px);
	line-height: 170%;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.104px;
	text-overflow: ellipsis;
}

.content {
	display: flex;
	height: 100%;
	overflow: hidden;
}
</style>
