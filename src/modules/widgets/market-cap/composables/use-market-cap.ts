import { computed, onBeforeMount, ref, watch } from 'vue';

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
import { fetchTickers, type ITickerItem } from '@/modules/ticker-selector';

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

	const _selectedTickers = ref<ITickerItem[]>([]);

	onBeforeMount(async () => {
		_selectedTickers.value = await fetchTickers(state.value.selectedTickers);
	});

	const selectedTickers = computed({
		get: () => _selectedTickers.value,
		set: (val: ITickerItem[]) => {
			_selectedTickers.value = val;
			state.value.selectedTickers = val.map(v => v.canonical_ticker_id);
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

	async function resetAllFilters() {
		const defaultState = getDefaultState();

		activeDateRange.value = defaultState.dateRange;
		selectedMarkets.value = defaultState.selectedMarkets;
		selectedTickers.value = await fetchTickers(defaultState.selectedTickers);
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryMarketCap(
		() => selectedTickers.value.map(v => v.canonical_ticker_id),
		selectedMarkets,
		activeDateRange,
	);

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
