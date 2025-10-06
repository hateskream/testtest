import { type ITickerData } from '@/shared/mock';
import { MarketType } from '@/modules/market';

export enum SegmentFilterIds {
	All = 'all',
	Selected = 'selected',
}

export interface ISegmentFilters {
	id: SegmentFilterIds;
	label: string;
	amount?: number;
}

export const segmentFilters: ISegmentFilters[] = [
	{
		id: SegmentFilterIds.All,
		label: 'All tickers',
		amount: 12312,
	},
	{
		id: SegmentFilterIds.Selected,
		label: 'Selected',
		amount: 12312,
	},
];

export type SelectAllFrom =
	| 'crypto'
	| 'stock'
	| 'index'
	| 'forex'
	| 'commodity'
	| 'all';

export type SelectedSegmentTickersState = Record<string, Set<string>>;

export interface ISegmentData {
	id: MarketType;
	label: string;
	tickers: ITickerData[];
}

export interface ISegmentRequest {
	selectAllFrom: SelectAllFrom[];
	selectTickers: string[];
	isAllTickersShow: boolean;
}

// export const segmentsData: ISegmentData[] = [
// 	{
// 		id: MarketType.Crypto,
// 		label: 'Crypto',
// 		tickers: getTickersByMarketType(MarketType.Crypto),
// 	},
// 	{
// 		id: MarketType.Stock,
// 		label: 'Stock',
// 		tickers: getTickersByMarketType(MarketType.Stock),
// 	},
// 	{
// 		id: MarketType.Forex,
// 		label: 'Forex',
// 		tickers: getTickersByMarketType(MarketType.Forex),
// 	},
// 	{
// 		id: MarketType.Commodities,
// 		label: 'Commodities',
// 		tickers: getTickersByMarketType(MarketType.Commodities),
// 	},
// 	{
// 		id: MarketType.Indices,
// 		label: 'Indices',
// 		tickers: getTickersByMarketType(MarketType.Indices),
// 	},
// ];
