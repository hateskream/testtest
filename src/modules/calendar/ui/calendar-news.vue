<script setup lang="ts">
import { computed } from 'vue';

import { type IGetNewsRequest, NewsFiltersPanel, useNews, useQueryNews, ViewNewsComponent } from '@/modules/news';

const {
	segments,
	selectedMarketSegments,
	selectedSegmentTickers,
	selectedSegmentRequest,

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
			:segments="segments"
			:selected-segments-tickers="selectedSegmentTickers"
			@select-all="selectAll"
			@unselect-all="unselectAll"
			@toggle-ticker="toggleTicker"
		/>
		<view-news-component
			:news="news"
			:display-settings="displaySettings"
			@next="fetchNextPage"
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
	font-size: var(--typography-headers-size-h-01, 13px);
	line-height: 170%;
	font-family: 'Roboto Flex', sans-serif;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.104px;
	text-overflow: ellipsis;
}
</style>
