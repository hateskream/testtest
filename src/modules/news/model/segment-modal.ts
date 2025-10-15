import { getTickersByMarketType, type ITickerData } from '@/shared/mock';
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

export type SelectAllFrom = MarketType | 'all';

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

export const segmentsData: ISegmentData[] = [
	{
		id: MarketType.Crypto,
		label: 'Crypto',
		tickers: [],
	},
	{
		id: MarketType.Stock,
		label: 'Stock',
		tickers: [],
	},
	{
		id: MarketType.Forex,
		label: 'Forex',
		tickers: [],
	},
	{
		id: MarketType.Commodities,
		label: 'Commodities',
		tickers: [],
	},
	{
		id: MarketType.Indices,
		label: 'Indices',
		tickers: [],
	},
];

Promise.all([
	getTickersByMarketType(MarketType.Crypto),
	getTickersByMarketType(MarketType.Stock),
	getTickersByMarketType(MarketType.Forex),
	getTickersByMarketType(MarketType.Commodities),
	getTickersByMarketType(MarketType.Indices),
]).then(([crypto, stock, forex, commodities, indices]) => {
	segmentsData[0].tickers = crypto;
	segmentsData[1].tickers = stock;
	segmentsData[2].tickers = forex;
	segmentsData[3].tickers = commodities;
	segmentsData[4].tickers = indices;
});
