import { computed, ref, watch } from 'vue';

import { createStateQueries } from '@/shared/service/data-repo';
import {
	getDefaultState,
	type IDisplaySettings,
	type IState,
	MarketCapDateRange,
	type MarketCapType,
	stateSchema,
	type StateSchemaType,
} from '../model';
import { useQueryMarketCap } from '../queries';
import { deepCompare } from '@/shared/lib/compare.ts';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useMarketCap({
	widgetId,
	isEphemeral,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__MARKET_CAP__',
		isSaveChange: !isEphemeral,
		getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();

	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState());

	const selectedTickers = computed({
		get: () => state.value.selectedTickers,
		set: (val: string[]) => {
			state.value.selectedTickers = val;
		},
	});

	const selectedMarkets = computed({
		get: () => state.value.selectedMarkets,
		set: (val: MarketCapType[]) => {
			state.value.selectedMarkets = val;
		},
	});

	const activeDateRange = computed({
		get: () => state.value.dateRange,
		set: (val: MarketCapDateRange) => {
			state.value.dateRange = val;
		},
	});

	const displaySettings = computed({
		get: () => state.value.displaySettings,
		set: (val: IDisplaySettings) => {
			state.value.displaySettings = val;
		},
	});

	watch(dataState, (newState, oldState) => {
		if (!newState) {
			return;
		}

		if (deepCompare(newState, oldState)) {
			return;
		}

		state.value = JSON.parse(JSON.stringify(newState));
	}, { immediate: true });

	watch(state, (newState, oldState) => {
		if (deepCompare(newState, oldState)) {
			return;
		}

		mutate(newState);
	}, { deep: true });

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	function resetAllFilters() {
		const defaultState = getDefaultState();

		activeDateRange.value = defaultState.dateRange;
		selectedTickers.value = defaultState.selectedTickers;
		selectedMarkets.value = defaultState.selectedMarkets;
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryMarketCap(selectedTickers, selectedMarkets, activeDateRange);

	return {
		selectedTickers,
		selectedMarkets,
		activeDateRange,
		displaySettings,
		data,
		isError,
		isLoading,
		history,
		refetch,
		resetAllChanges,
		applyStateToParent,
		resetAllFilters,
	};
}
