import { computed, ref, watch } from 'vue';

import {
	compareState,
	getActiveLocations,
	getDefaultState,
	type IDisplaySettings,
	type ILocation,
	type IState,
	Score,
	Sentiment,
	type SortState,
	Source,
} from '../model';
import { useGetState, useUpdateState } from '../queries';
import type { MarketType } from '@/modules/market';
import { useSegment } from '@/modules/news';

export function useNews(widgetId: string) {
	const { data: dataState } = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

	const state = ref<IState>(getDefaultState());

	const selectedMarketSegments = ref<Set<MarketType>>(new Set());

	const {
		segments,
		selectedSegmentRequest,
		selectedSegmentTickers,
		selectAll,
		unselectAll,
		toggleTicker,
	} = useSegment(selectedMarketSegments);

	watch(selectedSegmentRequest, (newValue) => {
		state.value.segment = newValue;
	});

	const selectedScores = computed({
		get: (): Set<Score> => state.value.score,
		set: (val: Set<Score>) => {
			state.value.score = val;
		},
	});

	const selectedSentiment = computed({
		get: () => state.value.sentiment,
		set: (val: Set<Sentiment>) => {
			state.value.sentiment = val;
		},
	});

	const selectedSources = computed({
		get: () => state.value.source,
		set: (val: Set<Source>) => {
			state.value.source = val;
		},
	});

	const selectedTickers = computed({
		get: () => state.value.selectedTickers,
		set: (val: string[]) => {
			state.value.selectedTickers = val;
		},
	});

	const displaySettings = computed({
		get: () => state.value.displaySettings,
		set: (val: IDisplaySettings) => {
			state.value.displaySettings = val;
		},
	});

	const locations = computed({
		get: (): ILocation[] => state.value.locations,
		set: (val: ILocation[]) => {
			state.value.locations = val;
		},
	});

	const sortBy = computed({
		get: () => state.value.activeSort,
		set: (val: SortState) => {
			state.value.activeSort = val;
		},
	});

	const activeLocations = computed(() => getActiveLocations(locations.value));

	watch(dataState, newState => {
		if (newState && !compareState(state.value, newState)) {
			state.value = { ...newState };
		}
	}, { immediate: true, deep: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	return {
		selectedMarketSegments,

		segments,
		selectedSegmentRequest,
		selectedSegmentTickers,
		selectAll,
		unselectAll,
		toggleTicker,

		selectedScores,
		selectedSentiment,
		selectedSources,
		selectedTickers,
		displaySettings,
		locations,
		sortBy,
		activeLocations,

		resetAllChanges,
	};
}
