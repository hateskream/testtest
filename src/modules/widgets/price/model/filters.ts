import { IconIds } from '@/shared/ui/icon';
import { MarketType } from '@/modules/market';

export enum FilterType {
	StockTrend = 'stock-trend',
	CryptoTrend = 'crypto-trend',
	RankingAndNew = 'rank',
	Sector = 'sector',
	TimeRange = 'range',
}

export enum StockTrendFilterValue {
	All = 'all',
	Gainers = 'gainers',
	Losers = 'losers',
	Top = 'top',
}

export enum CryptoTrendFilterValue {
	All = 'all',
	Gainers = 'gainers',
	Losers = 'losers',
	New = 'new',
}

export enum RankingAndNewFilterValue {
	All = 'all',
	Top = 'top',
	Gainers = 'gainers',
	Losers = 'losers',
	New = 'new',
}

export enum SectorFilterValue {
	All = 'all',
	Energy = 'energy',
	Metal = 'metal',
}

export enum TimeRangeFilterValue {
	Day = '1D',
	Week = '1W',
	Month = '1M',
	ThreeMonths = '3M',
	SixMonths = '6M',
	Year = '1Y',
}

export type FilterValue = StockTrendFilterValue |
	RankingAndNewFilterValue |
	SectorFilterValue |
	TimeRangeFilterValue |
	CryptoTrendFilterValue;

export const filtersByMarketType: Record<MarketType, FilterType[]> = {
	[MarketType.Crypto]: [FilterType.TimeRange, FilterType.CryptoTrend],
	[MarketType.Stock]: [FilterType.StockTrend, FilterType.TimeRange],
	[MarketType.Forex]: [FilterType.TimeRange],
	[MarketType.Commodities]: [FilterType.Sector, FilterType.TimeRange],
	[MarketType.Indices]: [FilterType.TimeRange],
};

export const filterTypeToValue: Record<FilterType, FilterValue[]> = {
	[FilterType.StockTrend]: Object.values(StockTrendFilterValue),
	[FilterType.CryptoTrend]: Object.values(CryptoTrendFilterValue),
	[FilterType.RankingAndNew]: Object.values(RankingAndNewFilterValue),
	[FilterType.Sector]: Object.values(SectorFilterValue),
	[FilterType.TimeRange]: Object.values(TimeRangeFilterValue),
};

interface IIcon {
	color: string;
	id: IconIds;
}

export interface IFilterDisplay {
	label: string;
	value: string;
	icon?: IIcon;
	selected?: string;
}

export const filterValueToDisplay: Record<FilterValue, IFilterDisplay> = {
	all: { label: 'All', value: 'all' },
	gainers: { label: 'Gainers', value: 'gainers', icon: {
		id: IconIds.Gainers,
		color: 'rgb(206 255 139 / 100%)',
	} },
	losers: { label: 'Losers', value: 'losers', icon: {
		id: IconIds.Loosers,
		color: 'rgb(248 89 97 / 50%)',
	} },
	top: { label: 'Top', value: 'top' },
	[RankingAndNewFilterValue.New]: { label: 'New', value: 'new' },
	[SectorFilterValue.Energy]: { label: 'Energy', value: 'energy' },
	[SectorFilterValue.Metal]: { label: 'Metal', value: 'metal' },
	[TimeRangeFilterValue.Day]: { label: '1 day', value: '1D', selected: '1D' },
	[TimeRangeFilterValue.Week]: { label: '1 week', value: '1W', selected: '1W' },
	[TimeRangeFilterValue.Month]: { label: '1 month', value: '1M', selected: '1M' },
	[TimeRangeFilterValue.ThreeMonths]: { label: '3 months', value: '3M', selected: '3M' },
	[TimeRangeFilterValue.SixMonths]: { label: '6 months', value: '6M', selected: '6M' },
	[TimeRangeFilterValue.Year]: { label: '1 year', value: '1Y', selected: '1Y' },
};

export const filterTypeToName: Record<FilterType, string> = {
	[FilterType.StockTrend]: 'Market Trend',
	[FilterType.CryptoTrend]: 'Crypto Trend',
	[FilterType.RankingAndNew]: 'Ranking & New',
	[FilterType.Sector]: 'Sector',
	[FilterType.TimeRange]: 'Time Range',
};

export type FiltersValues = Partial<Record<FilterType, IFilterDisplay[]>>;
export type FiltersState = Partial<Record<FilterType, FilterValue>>;

export const filters = Object.values(filterValueToDisplay);
