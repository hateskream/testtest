import { ref, watch } from 'vue';

import { createStateQueries } from '@/shared/service/data-repo';
import { compareState, getDefaultState, hydrateState, type IState, rehydrateState } from '../model';
import { stateSchema, type StateSchemaType } from '../services';
import { useNewsState } from './use-news-state';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType?: string;
}

export function useNews({ widgetId, isEphemeral, defaultStateType }: IOptions) {
	const state = ref<IState>(getDefaultState(defaultStateType));

	const {
		selectedMarketSegments,
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
	} = useNewsState({ state, defaultStateType });

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

	watch(dataState, newState => {
		if (newState && !compareState(state.value, newState)) {
			state.value = { ...newState };
		}
	}, { immediate: true, deep: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	return {
		selectedMarketSegments,
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
		applyStateToParent,
	};
}
