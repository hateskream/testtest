import type { CSSProperties } from 'vue';

import { SymbolType } from '@/modules/cell';

export const TickerType = {
	CRYPTO: 'crypto',
	STOCK: 'stock',
	FOREX: 'forex',
	COMMODITIES: 'commodities',
	INDICES: 'indices',
	ETF: 'etf',
} as const;

export type TickerType = typeof TickerType[keyof typeof TickerType];

const TickerTypeToSymbolType = {
	[TickerType.CRYPTO]: SymbolType.Crypto,
	[TickerType.STOCK]: SymbolType.Stock,
	[TickerType.FOREX]: SymbolType.Forex,
	[TickerType.COMMODITIES]: SymbolType.Commodity,
	[TickerType.INDICES]: SymbolType.Index,
	[TickerType.ETF]: SymbolType.Etf,
} as const satisfies Record<TickerType, SymbolType>;

export function createTickerIdFromType(type: TickerType, payload: string): string {
	return `${ TickerTypeToSymbolType[type] }-${payload}`;
}

export const TICKER_SECTION_COMPONENT = {
	TEST_SECTION_ONE: 'TEST_SECTION_ONE',
	TEST_SECTION_TWO: 'TEST_SECTION_TWO',
	INSIGHTS_SECTION: 'INSIGHTS_SECTION',
} as const;

export type TickerSectionComponent =
	typeof TICKER_SECTION_COMPONENT[keyof typeof TICKER_SECTION_COMPONENT];

export interface ISectionItem {
	title: string;
	component: TickerSectionComponent;
	height: CSSProperties['height'];
}


export type ViewMode = 'mixed' | 'reports';

export interface ITickerWidgetSections {
	left: ISectionItem[];
	center: ISectionItem[];
	right: ISectionItem[];
}

export const tickerStockSections = {
	left: [
		{
			title: 'Performance',
			component: TICKER_SECTION_COMPONENT.TEST_SECTION_ONE,
			height: 1000,
		},
	],
	center: [
		{
			title: 'Test section two',
			component: TICKER_SECTION_COMPONENT.TEST_SECTION_TWO,
			height: 1000,
		},
	],
	right: [
		{
			title: 'Insights & Activity',
			component: TICKER_SECTION_COMPONENT.INSIGHTS_SECTION,
			height: 1000,
		},
	],
} as const satisfies ITickerWidgetSections;

export const TICKER_SECTIONS_BY_TYPE = {
	[TickerType.STOCK]: tickerStockSections,
	[TickerType.CRYPTO]: tickerStockSections,
	[TickerType.FOREX]: tickerStockSections,
	[TickerType.COMMODITIES]: tickerStockSections,
	[TickerType.INDICES]: tickerStockSections,
	[TickerType.ETF]: tickerStockSections,
} as const;

export const getChartSectionsByType = (
	tickerType: TickerType,
): ITickerWidgetSections => {
	return TICKER_SECTIONS_BY_TYPE[tickerType];
};
