import { computed, ref } from 'vue';

import {
	getDefaultState,
	Score,
	Sentiment,
	Source,
	type IDisplaySettings,
	type ILocation,
	type IState,
	type SortState,
} from '../model';
import type { MarketType } from '@/modules/market';

export function useNews() {
	const state = ref<IState>(getDefaultState());

	const selectedScores = computed({
		get: (): Set<Score> => state.value.score,
		set: (val: Set<Score>) => {
			state.value.score = val;
		},
	});

	const selectedSegments = computed({
		get: () => state.value.segment,
		set: (val: Set<MarketType>) => {
			state.value.segment = val;
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

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	return {
		selectedScores,
		selectedSegments,
		selectedSentiment,
		selectedSources,
		selectedTickers,
		displaySettings,
		locations,
		sortBy,

		resetAllChanges,
	};
}
