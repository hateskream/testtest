import { computed, toValue } from 'vue';

import { ALL_MARKET_TYPES, MarketType } from '@/modules/market';
import {
	SelectionMode,
	MARKET_TICKER_ITEMS_BY_MARKET,
	type IUseTickerSelectorOptions,
	type ITickerItem,
	type IMarketTickerItem,
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
		events,
	} = options;

	const enableMarketTickers = computed(() => {
		return toValue(options.enableMarketTickers) ?? false;
	});

	const isAllSelectedInMarket = computed(() =>
		(ALL_MARKET_TYPES as readonly M[number][]).every(market =>
			selectedMarkets.value.includes(market),
		),
	);

	function hasInTickersList(list: ITickerItem[], id: string) {
		return list.some(t => t.canonical_ticker_id === id);
	}

	function getRemovedFromTickersList(list: ITickerItem[], market: MarketType, id: string) {
		return list.filter(t =>
			!(t.market_type === market && t.canonical_ticker_id === id),
		);
	}

	function upsertToList(list: ITickerItem[], ticker: ITickerItem) {
		return [
			...list.filter(t =>
				!(t.market_type === ticker.market_type && t.canonical_ticker_id === ticker.canonical_ticker_id),
			),
			ticker,
		];
	}

	function removeAllInMarket(list: ITickerItem[], market: MarketType) {
		return list.filter(t => t.market_type !== market);
	}

	function isTickerSelected(
		market: MarketType,
		ticker: { canonical_ticker_id: string } | string,
	) {
		const id = typeof ticker === 'object'
			? ticker.canonical_ticker_id
			: ticker;

		if (selectionMode === SelectionMode.Single) {
			return hasInTickersList(selectedTickers.value, id);
		}

		return isMarketSelected(market)
			? !hasInTickersList(excludedTickers.value, id)
			: hasInTickersList(selectedTickers.value, id);
	}

	function selectTicker(market: M[number], ticker: ITickerItem) {
		if (selectionMode !== SelectionMode.Single && selectedMarketTickers.value.length > 0) {
			return;
		}

		if (selectionMode === SelectionMode.Single) {
			clearAllTickers();
			selectedTickers.value = [ticker];
			events?.onTickerSelected?.(ticker);
			return;
		}

		if (isMarketSelected(market)) {
			excludedTickers.value = getRemovedFromTickersList(
				excludedTickers.value,
				market,
				ticker.canonical_ticker_id,
			);
			events?.onTickerUnexcluded?.(ticker);
			return;
		}

		selectedTickers.value = upsertToList(selectedTickers.value, ticker);
		events?.onTickerSelected?.(ticker);
	}

	function unselectTicker(market: M[number], ticker: ITickerItem) {
		if (selectionMode === SelectionMode.Single) {
			selectedTickers.value = removeAllInMarket(selectedTickers.value, market);
			events?.onTickerUnselected?.(ticker);
			return;
		}

		if (isMarketSelected(market)) {
			excludedTickers.value = upsertToList(excludedTickers.value, ticker);
			selectedTickers.value = getRemovedFromTickersList(
				selectedTickers.value,
				market,
				ticker.canonical_ticker_id,
			);
			events?.onTickerExcluded?.(ticker);
			return;
		}

		selectedTickers.value = getRemovedFromTickersList(
			selectedTickers.value,
			market,
			ticker.canonical_ticker_id,
		);
		events?.onTickerUnselected?.(ticker);
	}

	function toggleTicker(market: M[number], ticker: ITickerItem) {
		if (selectionMode === SelectionMode.Single) {
			clearAllTickers();
			selectedTickers.value = [ticker];
			return;
		}

		if (isTickerSelected(market, ticker)) {
			unselectTicker(market, ticker);
			return;
		}

		selectTicker(market, ticker);
	}

	function isMarketSelected(market: MarketType) {
		return selectedMarkets.value.includes(market);
	}

	function isMarketFullySelected(market: MarketType) {
		if (!isMarketSelected(market)) {
			return false;
		}

		return !excludedTickers.value.some(t => t.market_type === market);
	}

	function selectMarket(market: M[number]) {
		if (selectionMode === SelectionMode.Single) {
			return;
		}

		if (!selectedMarkets.value.includes(market)) {
			selectedMarkets.value = [...selectedMarkets.value, market];
		}

		selectedTickers.value = removeAllInMarket(selectedTickers.value, market);

		if (enableMarketTickers.value) {
			selectMarketTicker(market, MARKET_TICKER_ITEMS_BY_MARKET.get(market)!);
		}

		events?.onMarketSelected?.(market);
	}

	function unselectMarket(market: M[number]) {
		if (selectionMode === SelectionMode.Single) {
			return;
		}

		selectedMarkets.value = selectedMarkets.value.filter(m => m !== market);

		excludedTickers.value = excludedTickers.value.filter(t => t.market_type !== market);

		unselectMarketTicker(market, market);

		events?.onMarketUnselected?.(market);
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
			selectedTickers.value = [ticker];
			excludedTickers.value = [];
			events?.onTickerSelected?.(ticker);
			return;
		}

		if (isMarketSelected(market)) {
			if (hasInTickersList(excludedTickers.value, tickerId)) {
				excludedTickers.value = getRemovedFromTickersList(
					excludedTickers.value,
					market,
					tickerId,
				);
				events?.onTickerUnexcluded?.(ticker);
			} else {
				excludedTickers.value = upsertToList(excludedTickers.value, ticker);

				selectedTickers.value = getRemovedFromTickersList(
					selectedTickers.value,
					market,
					tickerId,
				);
				events?.onTickerExcluded?.(ticker);
			}

			return;
		}

		if (hasInTickersList(selectedTickers.value, tickerId)) {
			selectedTickers.value = getRemovedFromTickersList(
				selectedTickers.value,
				market,
				tickerId,
			);
			events?.onTickerUnselected?.(ticker);
		} else {
			selectedTickers.value = upsertToList(selectedTickers.value, ticker);

			excludedTickers.value = getRemovedFromTickersList(
				excludedTickers.value,
				market,
				tickerId,
			);
			events?.onTickerSelected?.(ticker);
		}
	}

	function clearAllTickers() {
		selectedTickers.value = [];
		excludedTickers.value = [];
		selectedMarketTickers.value = [];
	}

	function isMarketTickerSelected(market: M[number]) {
		return selectedMarketTickers.value.some(t => t.market_type === market);
	}

	function selectMarketTicker(
		market: M[number],
		ticker: IMarketTickerItem<M[number]>,
	) {
		if (!enableMarketTickers.value) {
			return;
		}

		selectedMarketTickers.value = [
			...selectedMarketTickers.value.filter(t => t.market_type !== market),
			ticker,
		];

		events?.onMarketTickerSelected?.(ticker);
	}

	function unselectMarketTicker(market: M[number], id: string) {
		const current = selectedMarketTickers.value.find(t => t.market_type === market);

		if (!current || current.market_type !== id) {
			return;
		}

		selectedMarketTickers.value =
			selectedMarketTickers.value.filter(t => t.market_type !== market);

		events?.onMarketTickerUnselected?.(current);
	}

	function toggleMarketTicker(
		market: M[number],
		ticker: IMarketTickerItem<M[number]>,
	) {
		if (isMarketTickerSelected(market)) {
			const current = selectedMarketTickers.value.find(t => t.market_type === market);

			selectedMarketTickers.value =
				selectedMarketTickers.value.filter(t => t.market_type !== market);

			if (current) {
				events?.onMarketTickerUnselected?.(current);
			}
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

	return {
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
