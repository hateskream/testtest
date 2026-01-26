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

export function extractTickerIds<M extends MarketType>(
	tickers: ITickerItem<M>[],
): string[] {
	return tickers.map(ticker => ticker.canonical_ticker_id);
}

export interface IUseTickerSelectorOptions<M extends readonly MarketType[]> {
	enabledMarkets: MaybeRefOrGetter<M>;
	selectionMode: SelectionMode;
	enableSelectAll?: MaybeRefOrGetter<boolean>;
	enableMarketTickers?: MaybeRefOrGetter<boolean>;

	selectedMarkets: Ref<readonly M[number][]>;
	selectedTickers: Ref<ITickerItem[]>;
	excludedTickers: Ref<ITickerItem[]>;
	selectedMarketTickers: Ref<IMarketTickerItem<M[number]>[]>;
}

export interface ITickerSelectorSettings<M extends readonly MarketType[]> {
	enabledMarkets: M;
	selectionMode: SelectionMode;
	enableSelectAll?: boolean;
}

export interface ITickerItem<M extends MarketType = MarketType> {
	canonical_ticker_id: string;
	market_type: M;
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
