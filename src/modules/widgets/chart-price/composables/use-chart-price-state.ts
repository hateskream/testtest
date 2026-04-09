import { computed, onBeforeMount, ref, type Ref } from 'vue';

import { useWatchlist } from '@/modules/watchlist';
import { type DateRangeValue } from '@/modules/charts/common/model';
import { decodeCanonicalTickerId, fetchTickers, type ITickerItem } from '@/modules/ticker-selector';
import { useQueryChartPriceHistory } from '../queries';
import { getDefaultsState, type IState } from '../model';

interface IOptions {
	defaultStateType: string;
	state: Ref<IState>;
}

export function useChartPriceState({ defaultStateType, state }: IOptions) {
	const {
		actionableWatchlists: watchlists,
		addToWatchlist,
		removeFromWatchlist,
		addTickerInNewWatchlist,
		toggleFavoriteWatchlist,
	} = useWatchlist();

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

	const selectedMarketType = computed(() => decodeCanonicalTickerId(selectedTickerId.value).market_type);

	async function resetAllChanges() {
		state.value = getDefaultsState(defaultStateType);
		[_selectedTicker.value] = await fetchTickers(state.value.selectedTicker);
	}

	function handleAddToWatchlist(watchlistId: string) {
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
	};
}
