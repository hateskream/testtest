import type { MaybeRefOrGetter, Ref } from 'vue';
import { z } from 'zod';

import { MarketType } from '@/modules/market';
import type { IMarketTickerItem } from '@/modules/ticker-selector';

export const ACTIVE_TICKER_LIST_COUNT_SHOW = 2;

export enum SelectionMode {
	Single = 'single',
	Multiple = 'multiple',
}

export enum SelectedSegment {
	All = 'all',
	Selected = 'selected',
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

export const marketTypeSchema = z.nativeEnum(MarketType);

export const tickerItemSchema = z.object({
	canonical_ticker_id: z.string(),
	market_type: marketTypeSchema,
	symbol: z.string(),
	name: z.string(),
	logo: z.string().optional(),
	currency: z.string().optional(),
	currency_icon: z.string().optional(),
});
