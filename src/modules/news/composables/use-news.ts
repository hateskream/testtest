import { computed, ref, watch } from 'vue';

import {
	compareState,
	getActiveLocations,
	getDefaultState,
	hydrateState,
	type IDisplaySettings,
	type ILocation,
	type IState,
	rehydrateState,
	Score,
	Sentiment,
	type SortState,
	Source,
} from '../model';
import { useSegment } from './use-segment';
import { stateSchema, type StateSchemaType } from '../services';
import { MarketType } from '@/modules/market';
import { createStateQueries } from '@/shared/service/data-repo';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType?: string;
}

export function useNews({ widgetId, isEphemeral, defaultStateType }: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__NEWS__',
		isSaveChange: true,
		getDefaultState: () => getDefaultState(defaultStateType),
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: hydrateState,
		rehydrateFn: rehydrateState,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState(defaultStateType));

	const selectedSegments = computed({
		get: () => state.value.segments,
		set: (val: Set<MarketType>) => {
			state.value.segments = val;
		},
	});

	const {
		segments,
		selectedSegmentRequest,
		selectedSegmentTickers,
		selectAll,
		unselectAll,
		toggleTicker,
	} = useSegment(selectedSegments);

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
		state.value = getDefaultState(defaultStateType);
	}

	return {
		selectedMarketSegments: selectedSegments,

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
		applyStateToParent,
	};
}
