import { computed, onBeforeMount, ref, type Ref } from 'vue';

import { fetchTickers, type ITickerItem } from '@/modules/ticker-selector';
import type { DateRangeValue } from '@/modules/charts/common/model';
import { getDefaultState, type IDisplaySettings, type IState, type MarketCapType } from '../model';
import { useQueryMarketCap } from '../queries';

interface IOptions {
	state: Ref<IState>;
}

export function useMarketCapState({ state }: IOptions) {
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
		set: (val: DateRangeValue) => {
			state.value.dateRange = val;
		},
	});

	const displaySettings = computed({
		get: () => state.value.displaySettings,
		set: (val: IDisplaySettings) => {
			state.value.displaySettings = val;
		},
	});

	async function resetAllChanges() {
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
		refetch,
		resetAllChanges,
	};
}
