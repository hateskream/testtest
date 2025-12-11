<script setup lang="ts">
import type { MarketType } from '@/modules/market';
import {
	ActiveDateRange,
	type ILocation, Include,
	type ISegmentData,
	Score,
	type SelectedSegmentTickersState,
	Sentiment,
	type SortState,
	Source,
} from '@/modules/news';
import type { IDateRange } from '@/shared/ui/calendar';

import TvNewsFiltersPanelComponent from './tv/tv-news-filters-panel-component.vue';
import DashboardNewsFiltersPanelComponent from './dashboard/dashboard-news-filters-panel-component.vue';

const props = withDefaults(defineProps<{
	displayVariant: 'tv' | 'dashboard';
	segments?: ISegmentData[];
	selectedSegmentsTickers?: SelectedSegmentTickersState;
}>(), {
	segments: () => [],
	selectedSegmentsTickers: () => ({}),
});

const emits = defineEmits<{
	selectAll: [id: MarketType];
	unselectAll: [id: MarketType];
	toggleTicker: [id: MarketType, tickerId: string];
	resetAllChanges: [];
}>();

const locations = defineModel<ILocation[]>('locations', { required: true });
const sortBy = defineModel<SortState>('sortBy', { required: true });

const selectedScores = defineModel<Set<Score>>('selectedScores', { required: true });
const selectedSegments = defineModel<Set<MarketType>>('selectedSegments', { required: true });
const selectedSentiment = defineModel<Set<Sentiment>>('selectedSentiment', { required: true });
const selectedSources = defineModel<Set<Source>>('selectedSources', { required: true });
const include = defineModel<Set<Include>>('include', { required: true });
const activeDateRange = defineModel<ActiveDateRange>('activeDateRange', { required: true });
const dateRange = defineModel<IDateRange>('dateRange', { required: true });
</script>

<template>
	<tv-news-filters-panel-component
		v-if="props.displayVariant === 'tv'"
		v-model:locations="locations"
		v-model:sort-by="sortBy"
		v-model:selected-scores="selectedScores"
		v-model:selected-segments="selectedSegments"
		v-model:selected-sentiment="selectedSentiment"
		v-model:selected-sources="selectedSources"
		v-model:include="include"
		v-model:active-date-range="activeDateRange"
		v-model:date-range="dateRange"
		:display-variant="props.displayVariant"
		:segments="props.segments"
		:selected-segments-tickers="props.selectedSegmentsTickers"
		@select-all="emits('selectAll', $event)"
		@unselect-all="emits('unselectAll', $event)"
		@toggle-ticker="(v1: MarketType, v2: string) => emits('toggleTicker', v1, v2)"
	/>
	<dashboard-news-filters-panel-component
		v-else
		v-model:locations="locations"
		v-model:sort-by="sortBy"
		v-model:selected-scores="selectedScores"
		v-model:selected-segments="selectedSegments"
		v-model:selected-sentiment="selectedSentiment"
		v-model:selected-sources="selectedSources"
		v-model:include="include"
		v-model:active-date-range="activeDateRange"
		v-model:date-range="dateRange"
		:display-variant="props.displayVariant"
		:segments="props.segments"
		:selected-segments-tickers="props.selectedSegmentsTickers"
		@select-all="emits('selectAll', $event)"
		@unselect-all="emits('unselectAll', $event)"
		@toggle-ticker="(v1: MarketType, v2: string) => emits('toggleTicker', v1, v2)"
		@reset-all-changes="emits('resetAllChanges')"
	/>
</template>
