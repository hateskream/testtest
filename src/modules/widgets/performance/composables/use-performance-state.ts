import { computed, type Ref } from 'vue';

import { MarketType } from '@/modules/market';
import {
	Currency,
	type DateRange,
	DateRangeForex,
	DateRangeStock,
	DisplayVariant,
	getDefaultState,
	type IState,
	type ITicker,
	type PerformanceMarketType,
	Stock,
	SymbolDisplayVariant,
} from '../model';
import { useQueryPerformance } from '../queries';

interface IOptions {
	defaultStateType: string;
	state: Ref<IState>;
	limit: Ref<number>;
}

export function usePerformanceState({
	defaultStateType,
	state,
	limit,
}: IOptions) {

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: PerformanceMarketType) => {
			state.value.activeMarket = val;
		},
	});

	const currentSettings = computed(() => state.value.settings[state.value.activeMarket]);

	const currentDisplayVariant = computed({
		get: () => currentSettings.value.displayVariant,
		set: (val: DisplayVariant) => (currentSettings.value.displayVariant = val),
	});

	const isCompactMode = computed({
		get: () => currentSettings.value.isCompactMode,
		set: (val: boolean) => (currentSettings.value.isCompactMode = val),
	});

	const currentStock = computed({
		get: () =>
			state.value.activeMarket === MarketType.Stock
				? state.value.settings[MarketType.Stock].stock
				: undefined,
		set: (val: Stock | undefined) => {
			if (val && state.value.activeMarket === MarketType.Stock) {
				state.value.settings[MarketType.Stock].stock = val;
			}
		},
	});

	const currentDate = computed({
		get: () => {
			if (state.value.activeMarket === MarketType.Stock) {
				return state.value.settings[MarketType.Stock].periodStock;
			}
			return state.value.settings[MarketType.Forex].periodForex;
		},
		set: (val: DateRange) => {
			if (state.value.activeMarket === MarketType.Stock) {
				state.value.settings[MarketType.Stock].periodStock =
					val as DateRangeStock;
			} else {
				state.value.settings[MarketType.Forex].periodForex =
					val as DateRangeForex;
			}
		},
	});

	const currentSymbolDisplayVariant = computed({
		get: () =>
			state.value.activeMarket === MarketType.Forex
				? state.value.settings[MarketType.Forex].symbolDisplayVariant
				: undefined,
		set: (val: SymbolDisplayVariant | undefined) => {
			if (val && state.value.activeMarket === MarketType.Forex) {
				state.value.settings[MarketType.Forex].symbolDisplayVariant = val;
			}
		},
	});

	const quoteCurrency = computed({
		get: () => state.value.activeMarket === MarketType.Forex
			? state.value.settings[MarketType.Forex].quoteCurrency
			: undefined,
		set: (val: Currency) => {
			if (val && state.value.activeMarket === MarketType.Forex) {
				state.value.settings[MarketType.Forex].quoteCurrency = val;
			}
		},
	});

	const pinnedTickers = computed({
		get: () => currentSettings.value.pinned ?? [],
		set: (value: string[]) => {
			state.value.settings[activeMarket.value].pinned = [...value];
		},
	});

	const {
		data: dataResponse,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
	} = useQueryPerformance(activeMarket, pinnedTickers, currentDate, currentStock, quoteCurrency, limit);

	const tickers = computed((): ITicker[] => {
		if (!dataResponse.value) {
			return [];
		}

		const allTickers = [
			...dataResponse.value.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? [],
			...dataResponse.value.pages.flatMap(page => page?.pinedTickers).filter(t => !!t) ?? [],
		];

		const pinedIds = new Set(pinnedTickers.value);

		const pinedTickers = allTickers
			.filter(t => pinedIds.has(t.tickerId))
			.map(t => ({
				...t,
				isShow: true,
				isPined: true,
			}));

		const otherTickers = allTickers
			.filter(t => !pinedIds.has(t.tickerId))
			.map(t => ({
				...t,
				isShow: true,
				isPined: false,
			}));

		const sortedPinedTickers = pinnedTickers.value
			.map(id => pinedTickers.find(t => t.tickerId === id))
			.filter(t => !!t);

		return [
			...sortedPinedTickers,
			...otherTickers,
		];
	});

	function togglePin(tickerId: string) {
		if (pinnedTickers.value.includes(tickerId)) {
			unpin(tickerId);
		} else {
			pin(tickerId);
		}
	}

	function pin(tickerId: string) {
		if (!pinnedTickers.value.includes(tickerId)) {
			pinnedTickers.value = [...pinnedTickers.value, tickerId];
		}
	}

	function unpin(tickerId: string) {
		pinnedTickers.value = pinnedTickers.value.filter((id) => id !== tickerId);
	}

	function loadMore() {
		if (hasNextPage.value && !isFetchingNextPage.value) {
			void fetchNextPage();
		}
	}

	function resetAllChanges() {
		state.value = getDefaultState(defaultStateType);
		pinnedTickers.value =
			state.value.settings[state.value.activeMarket].pinned;
	}

	return {
		activeMarket,
		currentDisplayVariant,
		isCompactMode,
		currentStock,
		currentDate,
		currentSymbolDisplayVariant,
		tickers,
		quoteCurrency,
		pinnedTickers,

		togglePin,

		loadMore,
		resetAllChanges,
		isLoading,
		isError,
		refetch,
	};
}
