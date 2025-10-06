import { MarketType } from '@/modules/market';
import type { IconIds } from '@/shared/ui/icon';

export enum FilterType {
	MarketTrend = 'market-trend',
	RankingAndNew = 'ranking-and-new',
	Sector = 'sector-filter',
	TimeRange = 'time-range',
}

export enum MarketTrendFilterValue {
	All = 'all',
	Gainers = 'gainers',
	Losers = 'losers',
	Top = 'top',
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

export type FilterValue = MarketTrendFilterValue | RankingAndNewFilterValue | SectorFilterValue | TimeRangeFilterValue;

export const filtersByMarketType: Record<MarketType, FilterType[]> = {
	[MarketType.Crypto]: [FilterType.TimeRange, FilterType.RankingAndNew],
	[MarketType.Stock]: [FilterType.TimeRange, FilterType.MarketTrend],
	[MarketType.Forex]: [FilterType.TimeRange],
	[MarketType.Commodities]: [FilterType.TimeRange, FilterType.Sector],
	[MarketType.Indices]: [FilterType.TimeRange],
};

export const filterTypeToValue: Record<FilterType, FilterValue[]> = {
	[FilterType.MarketTrend]: Object.values(MarketTrendFilterValue),
	[FilterType.RankingAndNew]: Object.values(RankingAndNewFilterValue),
	[FilterType.Sector]: Object.values(SectorFilterValue),
	[FilterType.TimeRange]: Object.values(TimeRangeFilterValue),
};

export interface IFilterDisplay {
	label: string;
	value: string;
	icon?: {
		color: string;
		id: IconIds;
	};
}

export const filterValueToDisplay: Record<FilterValue, IFilterDisplay> = {
	all: { label: 'All', value: 'all' },
	gainers: { label: 'Gainers', value: 'gainers' },
	losers: { label: 'Losers', value: 'losers' },
	top: { label: 'Top', value: 'top' },
	[RankingAndNewFilterValue.New]: { label: 'New', value: 'new' },
	[SectorFilterValue.Energy]: { label: 'Energy', value: 'energy' },
	[SectorFilterValue.Metal]: { label: 'Metal', value: 'metal' },
	[TimeRangeFilterValue.Day]: { label: 'Day', value: '1D' },
	[TimeRangeFilterValue.Week]: { label: 'Week', value: '1W' },
	[TimeRangeFilterValue.Month]: { label: 'Month', value: '1M' },
	[TimeRangeFilterValue.ThreeMonths]: { label: '3 Months', value: '3M' },
	[TimeRangeFilterValue.SixMonths]: { label: '6 Months', value: '6M' },
	[TimeRangeFilterValue.Year]: { label: 'Year', value: '1Y' },
};

export const filterTypeToName: Record<FilterType, string> = {
	[FilterType.MarketTrend]: 'Market Trend',
	[FilterType.RankingAndNew]: 'Ranking & New',
	[FilterType.Sector]: 'Sector',
	[FilterType.TimeRange]: 'Time Range',
};

export type FiltersValues = Partial<Record<FilterType, IFilterDisplay[]>>;
export type FiltersState = Partial<Record<FilterType, FilterValue>>;
