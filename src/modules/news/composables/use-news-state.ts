import { computed, ref, type Ref } from 'vue';

import { MarketType } from '@/modules/market';
import type { IDateRange } from '@/shared/ui/calendar';
import {
	type ActiveDateRangeType,
	getActiveLocations,
	getDefaultActiveDateRange,
	getDefaultDateRange,
	getDefaultSegmentMarkets,
	getDefaultState,
	type IDisplaySettings,
	type ILocation,
	type IncludeType,
	type IState,
	type ScoreType,
	type SentimentType,
	type SortState,
	type SourceType,
} from '../model';
import { useSegment } from './use-segment';

interface IOptions {
	defaultStateType?: string;
	state: Ref<IState>;
}

export function useNewsState({ state, defaultStateType }: IOptions) {
	const selectedSegments = computed({
		get: () => state.value.segments,
		set: (val: Set<MarketType>) => {
			state.value.segments = val;
		},
	});

	const {
		selectedSegmentsRequest,
		excludedTickers,
		selectedTickers,
		selectedMarkets,
	} = useSegment(defaultStateType);

	const selectedScores = computed({
		get: (): Set<ScoreType> => state.value.score,
		set: (val: Set<ScoreType>) => {
			state.value.score = val;
		},
	});

	const selectedSentiment = computed({
		get: () => state.value.sentiment,
		set: (val: Set<SentimentType>) => {
			state.value.sentiment = val;
		},
	});

	const selectedSources = computed({
		get: () => state.value.source,
		set: (val: Set<SourceType>) => {
			state.value.source = val;
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

	const activeLocations = computed(
		() => getActiveLocations(locations.value),
	);

	const include = computed({
		get: () => state.value.include,
		set: (val: Set<IncludeType>) => {
			state.value.include = val;
		},
	});

	const activeDateRange = ref<ActiveDateRangeType>(getDefaultActiveDateRange());
	const dateRange = ref<IDateRange>(getDefaultDateRange());

	function resetAllChanges() {
		state.value = getDefaultState(defaultStateType);

		selectedTickers.value = [];
		selectedMarkets.value = getDefaultSegmentMarkets(defaultStateType);
		excludedTickers.value = [];

		activeDateRange.value = getDefaultActiveDateRange();
		dateRange.value = getDefaultDateRange();
	}

	return {
		selectedMarketSegments: selectedSegments,
		selectedSegmentsRequest,
		selectedTickers,
		excludedTickers,
		selectedMarkets,

		selectedScores,
		selectedSentiment,
		selectedSources,
		displaySettings,
		locations,
		sortBy,
		activeLocations,
		include,
		activeDateRange,
		dateRange,

		resetAllChanges,
	};
}
