import { inject, provide } from 'vue';

import type { MarketType } from '@/modules/market';
import type { IMarketTickerItem, ITickerItem } from '@/modules/ticker-selector';

export interface ITickerSelectorMethodsContext<
	M extends readonly MarketType[],
> {
	isMarketSelected(market: MarketType): boolean;
	isMarketFullySelected(market: MarketType): boolean;

	selectMarket(market: M[number]): void;
	unselectMarket(market: M[number]): void;
	toggleMarket(market: M[number]): void;

	isTickerSelected(market: MarketType, tickerId: string): boolean;

	selectTicker(market: M[number], ticker: ITickerItem): void;
	unselectTicker(market: M[number], ticker: ITickerItem): void;
	toggleTicker(market: M[number], ticker: ITickerItem): void;
	selectOrExcludeTickerToggle(market: M[number], ticker: ITickerItem): void;

	isMarketTickerSelected(market: M[number], id: string): boolean;

	selectMarketTicker(market: M[number], ticker: IMarketTickerItem<M[number]>): void;
	unselectMarketTicker(market: M[number], id: string): void;
	toggleMarketTicker(market: M[number], ticker: IMarketTickerItem<M[number]>): void;

	clearAllTickers(): void;
}

const TickerSelectorKey =
	Symbol('TickerSelector');

export function provideTickerSelectorContext<
	const M extends readonly MarketType[],
>(
	methods: ITickerSelectorMethodsContext<M>,
) {
	provide(TickerSelectorKey, methods);
}

export function useTickerSelectorContext<
	M extends readonly MarketType[],
>() {
	const ctx = inject(TickerSelectorKey);

	if (!ctx) {
		throw new Error('TickerSelectorMethodsContext is not provided');
	}

	return ctx as ITickerSelectorMethodsContext<M>;
}
