import { computed, onBeforeMount, ref, watch } from 'vue';
import { z } from 'zod';

import { getDefaultsState, type IState } from '../model';
import { createStateQueries } from '@/shared/service/data-repo';
import { useWatchlist } from '@/modules/watchlist';
import { useQueryChartPriceHistory } from '../queries';
import { decodeCanonicalTickerId, fetchTickers, type ITickerItem } from '@/modules/ticker-selector';
import { deepCompare } from '@/shared/lib/compare';
import { type DateRangeValue, DateRangeValueSchema } from '@/modules/charts/common/model';

export const stateSchema = z.object({
	selectedTicker: z.string(),
	timeRange: DateRangeValueSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;
export type StateSchemaInputType = z.input<typeof stateSchema>;

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType: string;
}

export function useChartPrice({
	widgetId,
	isEphemeral,
	defaultStateType,
}: IOptions) {
	const {
		actionableWatchlists: watchlists,
		addToWatchlist,
		removeFromWatchlist,
		addTickerInNewWatchlist,
		toggleFavoriteWatchlist,
	} = useWatchlist();

	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType, StateSchemaInputType>({
		isEphemeral,
		storageKey: '__CHART_PRICE__',
		isSaveChange: !isEphemeral,
		getDefaultState: () => getDefaultsState(defaultStateType),
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const state = ref<IState>(getDefaultsState(defaultStateType));

	const _selectedTicker = ref<ITickerItem | null>(null);

	onBeforeMount(async () => {
		[_selectedTicker.value] = await fetchTickers(state.value.selectedTicker);
	});

	const selectedTickersModel = computed({
		get: () => _selectedTicker.value ? [_selectedTicker.value] : [],
		set: ([value]: ITickerItem[]) => {
			if (!value) {
				return;
			}

			_selectedTicker.value = value;
			state.value.selectedTicker = value.canonical_ticker_id;
		},
	});

	const selectedTickerId = computed({
		get: () => state.value.selectedTicker,
		set: (val: string) => {
			state.value.selectedTicker = val;
		},
	});

	const timeRange = computed({
		get: () => state.value.timeRange,
		set: (val: DateRangeValue) => {
			state.value.timeRange = val;
		},
	});

	const {
		data: dataState,
	} = useStateQuery();
	const { mutate } = useStateMutation();

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
		}
	}, { immediate: true });

	watch(() => state.value, (newState, oldState) => {
		if (deepCompare(newState, oldState)) {
			return;
		}

		mutate(newState);
	}, { deep: true });

	const selectedMarketType = computed(() => decodeCanonicalTickerId(selectedTickerId.value).market_type);

	async function resetAllChanges() {
		state.value = getDefaultsState(defaultStateType);
		[_selectedTicker.value] = await fetchTickers(state.value.selectedTicker);
	}

	function handleAddToWatchlist(watchlistId: string ) {
		const marketType = selectedMarketType.value;
		if (!marketType) {
			return;
		}

		addToWatchlist(watchlistId, selectedTickerId.value, marketType);
	}

	function handleRemoveFromWatchlist(watchlistId: string) {
		removeFromWatchlist(watchlistId, selectedTickerId.value);
	}

	function handleAddTickerInNewWatchlist() {
		const marketType = _selectedTicker.value?.market_type;

		if (!marketType) {
			return;
		}

		addTickerInNewWatchlist(selectedTickerId.value, marketType);
	}

	function handleToggleFavoriteWatchlist() {
		const marketType = _selectedTicker.value?.market_type;

		if (!marketType) {
			return;
		}

		toggleFavoriteWatchlist(selectedTickerId.value, marketType);
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryChartPriceHistory(selectedTickerId, timeRange);

	return {
		selectedTickerId,
		selectedTickersModel,
		timeRange,
		state,
		watchlists,

		data,
		isLoading,
		isError,
		refetch,

		handleAddToWatchlist,
		handleRemoveFromWatchlist,
		handleAddTickerInNewWatchlist,
		handleToggleFavoriteWatchlist,
		resetAllChanges,
		applyStateToParent,
	};
}
