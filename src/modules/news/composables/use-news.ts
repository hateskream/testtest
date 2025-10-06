import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import {
	compareState,
	getActiveLocations,
	getDefaultState,
	Source,
	Sort,
	type IDisplaySettings,
	type ILocation,
	type IState,
	Score,
	Sentiment,
	type SortState,
	rehydrateState,
	hydrateState,
} from '../model';
import { MarketType } from '@/modules/market';
import { createStateQueries } from '@/shared/service/data-repo';
import { useSegment } from '@/modules/news';

const displaySettingsSchema = z.object({
	isShowDate: z.boolean(),
	isShowSource: z.boolean(),
	isShowDesc: z.boolean(),
	isShowAuthor: z.boolean(),
	isShowSymbols: z.boolean(),
	isShowScore: z.boolean(),
});

const activeLocationSchema = z.object({
	region: z.string(),
	countries: z.array(z.string()),
});

export const stateSchema = z.object({
	score: z.array(z.nativeEnum(Score)),
	segment: z.object({
		selectAllFrom: z.array(z.enum(['crypto', 'stock', 'index', 'forex', 'commodity', 'all'])),
		selectTickers: z.array(z.string()),
		isAllTickersShow: z.boolean(),
	}),
	sentiment: z.array(z.nativeEnum(Sentiment)),
	source: z.array(z.nativeEnum(Source)),
	selectedTickers: z.array(z.string()),
	activeSort: z.nativeEnum(Sort).nullable(),
	displaySettings: displaySettingsSchema,
	locations: z.array(activeLocationSchema),
});

export type StateSchemaType = z.infer<typeof stateSchema>;


export function useNews(widgetId: string) {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IState, StateSchemaType>({
		storageKey: '__NEWS__',
		isSaveChange: true,
		getDefaultState: getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: hydrateState,
		rehydrateFn: rehydrateState,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();
	const { mutate } = useStateMutation();

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
