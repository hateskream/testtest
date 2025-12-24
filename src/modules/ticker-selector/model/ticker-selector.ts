import type { MaybeRefOrGetter, Ref } from 'vue';

import type { MarketType } from '@/modules/market';
import type { IMarketTickerItem } from '@/modules/ticker-selector';

export enum SelectionMode {
	Single = 'single',
	Multiple = 'multiple',
}

export enum SelectedSegment {
	All = 'all',
	Selected = 'selected',
}

export type MarketTickersMap<M extends MarketType> =
	Map<M, Map<string, ITickerItem>>;

export function createTickerModel<M extends readonly MarketType[]>(
	markets: M,
): MarketTickersMap<M[number]> {
	return new Map(
		markets.map(market => [market, new Map<string, ITickerItem>()]),
	);
}

export function mapToTickerArray<M extends MarketType>(
	map: MarketTickersMap<M>,
): ITickerItem[] {
	const result: ITickerItem[] = [];

	for (const [, marketMap] of map) {
		result.push(...marketMap.values());
	}

	return result;
}

export function arrayToTickerMap<M extends MarketType>(
	tickers: ITickerItem[] | undefined,
	markets: readonly M[],
): MarketTickersMap<M> {
	const map = new Map<M, Map<string, ITickerItem>>();

	for (const market of markets) {
		map.set(market, new Map());
	}

	for (const ticker of tickers ?? []) {
		const market = ticker.market_type as M;
		const marketMap = map.get(market);

		if (marketMap) {
			marketMap.set(ticker.canonical_ticker_id, ticker);
		}
	}

	return map;
}

export function getMarketMap(
	map: MarketTickersMap<MarketType>,
	market: MarketType,
): Map<string, ITickerItem> {
	const marketMap = map.get(market);

	if (!marketMap) {
		return new Map<string, ITickerItem>();
	}

	return marketMap;
}

export function extractTickerIds<M extends MarketType>(
	map: MarketTickersMap<M>,
): string[] {
	return Array.from(map.values()).flatMap(tickers =>
		Array.from(tickers.keys()),
	);
}

export interface IUseTickerSelectorOptions<M extends readonly MarketType[]> {
	enabledMarkets: MaybeRefOrGetter<M>;
	selectionMode: SelectionMode;
	enableSelectAll?: MaybeRefOrGetter<boolean>;
	enableMarketTickers?: MaybeRefOrGetter<boolean>;

	selectedMarkets: Ref<Set<M[number]>>;
	selectedTickers: Ref<MarketTickersMap<M[number]>>;
	excludedTickers: Ref<MarketTickersMap<M[number]>>;

	selectedMarketTickers: Ref<Map<M[number], IMarketTickerItem<M[number]>>>;
}

export interface ITickerSelectorSettings<M extends readonly MarketType[]> {
	enabledMarkets: M;
	selectionMode: SelectionMode;
	enableSelectAll?: boolean;
}

export interface ITickerItem {
	canonical_ticker_id: string;
	market_type: MarketType;
	symbol: string;
	name: string;
	logo?: string;

	currency?: string;
	currency_icon?: string;
}

export interface ITickerCategory {
	market_type: MarketType;
	ticker_count: number;
	tickers: ITickerItem[];
}
