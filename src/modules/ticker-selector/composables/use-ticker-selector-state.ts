import { computed, toValue, watch } from 'vue';

import { MarketType } from '@/modules/market';
import {
	getMarketMap as getMarketSetUtil,
	createTickerModel,
	SelectionMode,
	type IUseTickerSelectorOptions,
	type ITickerItem,
	type ITickerSelectorSettings, type IMarketTickerItem, MARKET_TICKER_ITEMS_BY_MARKET,
} from '../model';
import { provideTickerSelectorContext } from './use-ticker-selector-context.ts';

export function useTickerSelectorState<
	const M extends readonly MarketType[],
>(options: IUseTickerSelectorOptions<M>) {
	const {
		selectionMode,
		selectedMarkets,
		selectedTickers,
		excludedTickers,
		selectedMarketTickers,
	} = options;

	const markets = computed(() => {
		return toValue(options.enabledMarkets) ?? Object.values(MarketType) as unknown as M;
	});

	const enableSelectAll = computed(() => {
		return toValue(options.enableSelectAll) ?? true;
	});

	const enableMarketTickers = computed(() => {
		return toValue(options.enableMarketTickers) ?? false;
	});

	watch(markets, (value) => {
		selectedTickers.value = createTickerModel(value);
		excludedTickers.value = createTickerModel(value);
	});

	const isAllSelectedInMarket = computed(() =>
		(Object.values(MarketType) as readonly M[number][]).every(market =>
			selectedMarkets.value.has(market),
		),
	);

	function hasAnySelectedMarketTickers() {
		return selectedMarketTickers.value.size > 0;
	}

	function getExcludedSet(market: MarketType) {
		return getMarketSetUtil(excludedTickers.value, market);
	}

	function getSelectedMap(market: MarketType) {
		return getMarketSetUtil(selectedTickers.value, market);
	}

	function isTickerSelected(market: MarketType, ticker: { canonical_ticker_id: string } | string) {
		const id = typeof ticker === 'object' ? ticker.canonical_ticker_id : ticker;

		if (selectionMode === SelectionMode.Single) {
			return getSelectedMap(market).has(id);
		}

		return isMarketSelected(market)
			? !getExcludedSet(market).has(id)
			: getSelectedMap(market).has(id);
	}

	function selectTicker(market: M[number], ticker: ITickerItem) {
		if (selectionMode !== SelectionMode.Single && hasAnySelectedMarketTickers()) {
			return;
		}

		if (selectionMode === SelectionMode.Single) {
			clearAllTickers();
			getSelectedMap(market).set(ticker.canonical_ticker_id, ticker);
			return;
		}

		if (isMarketSelected(market)) {
			getExcludedSet(market).delete(ticker.canonical_ticker_id);
			return;
		}

		getSelectedMap(market).set(ticker.canonical_ticker_id, ticker);
	}

	function unselectTicker(market: M[number], ticker: ITickerItem) {
		if (selectionMode === SelectionMode.Single) {
			getSelectedMap(market).clear();
			return;
		}

		if (isMarketSelected(market)) {
			getExcludedSet(market).set(ticker.canonical_ticker_id, ticker);
			return;
		}

		getSelectedMap(market).delete(ticker.canonical_ticker_id);
	}

	function toggleTicker(market: M[number], ticker: ITickerItem) {
		if (selectionMode === SelectionMode.Single) {
			clearAllTickers();
			getSelectedMap(market).set(ticker.canonical_ticker_id, ticker);
			return;
		}

		if (isTickerSelected(market, ticker)) {
			unselectTicker(market, ticker);
			return;
		}

		selectTicker(market, ticker);
	}

	function isMarketSelected(market: MarketType) {
		return selectedMarkets.value.has(market);
	}

	function isMarketFullySelected(market: MarketType) {
		if (!selectedMarkets.value.has(market)) {
			return false;
		}

		return getExcludedSet(market).size === 0;
	}

	function selectMarket(market: M[number]) {
		if (selectionMode === SelectionMode.Single) {
			return;
		}

		selectedMarkets.value.add(market);
		getSelectedMap(market).clear();

		if (enableMarketTickers.value) {
			selectMarketTicker(market, MARKET_TICKER_ITEMS_BY_MARKET.get(market)!);
		}
	}

	function unselectMarket(market: M[number]) {
		if (selectionMode === SelectionMode.Single) {
			return;
		}

		selectedMarkets.value.delete(market);
		getExcludedSet(market).clear();
		unselectMarketTicker(market, market);
	}

	function toggleMarket(market: M[number]) {
		if (isMarketSelected(market)) {
			unselectMarket(market);
			return;
		}

		selectMarket(market);
	}

	function selectOrExcludeTickerToggle(market: M[number], ticker: ITickerItem) {
		const tickerId = ticker.canonical_ticker_id;

		if (selectionMode === SelectionMode.Single) {
			for (const m of markets.value) {
				getSelectedMap(m).clear();
				getExcludedSet(m).clear();
			}

			getSelectedMap(market).set(tickerId, ticker);
			return;
		}

		if (isMarketSelected(market)) {
			const excluded = getExcludedSet(market);

			if (excluded.has(tickerId)) {
				excluded.delete(tickerId);
			} else {
				excluded.set(tickerId, ticker);
				getSelectedMap(market).delete(tickerId);
			}

			return;
		}

		const selected = getSelectedMap(market);

		if (selected.has(tickerId)) {
			selected.delete(tickerId);
		} else {
			selected.set(tickerId, ticker);
			getExcludedSet(market).delete(tickerId);
		}
	}

	function clearAllTickers() {
		for (const market of markets.value) {
			getSelectedMap(market).clear();
			getExcludedSet(market).clear();
		}

		selectedMarketTickers.value.clear();
	}

	function isMarketTickerSelected(
		market: M[number],
	) {
		return !!selectedMarketTickers.value.get(market);
	}

	function selectMarketTicker(
		market: M[number],
		ticker: IMarketTickerItem<M[number]>,
	) {
		if (!enableMarketTickers.value) {
			return;
		}

		selectedMarketTickers.value.set(market, ticker);
	}

	function unselectMarketTicker(
		market: M[number],
		id: string,
	) {
		const current = selectedMarketTickers.value.get(market);

		if (!current || current.market_type !== id) {
			return;
		}

		selectedMarketTickers.value.delete(market);
	}

	function toggleMarketTicker(
		market: M[number],
		ticker: IMarketTickerItem<M[number]>,
	) {
		if (isMarketTickerSelected(market)) {
			selectedMarketTickers.value.delete(market);
			return;
		}

		selectMarketTicker(market, ticker);
	}

	provideTickerSelectorContext({
		isMarketSelected,
		isMarketFullySelected,
		selectMarket,
		unselectMarket,
		toggleMarket,
		isTickerSelected,
		selectTicker,
		unselectTicker,
		toggleTicker,
		selectOrExcludeTickerToggle,
		clearAllTickers,
		isMarketTickerSelected,
		selectMarketTicker,
		unselectMarketTicker,
		toggleMarketTicker,
	});

	const settings = computed<ITickerSelectorSettings<M>>(() => ({
		enabledMarkets: markets.value,
		selectionMode: selectionMode,
		enableSelectAll: enableSelectAll.value,
	}));

	return {
		settings,

		selectedMarkets,
		excludedTickers,
		selectedTickers,
		selectedMarketTickers,
		isAllSelectedInMarket,

		isMarketSelected,
		isMarketFullySelected,
		selectMarket,
		unselectMarket,
		toggleMarket,

		isTickerSelected,
		selectTicker,
		unselectTicker,
		toggleTicker,
		selectOrExcludeTickerToggle,

		isMarketTickerSelected,
		selectMarketTicker,
		unselectMarketTicker,
		toggleMarketTicker,
	};
}
