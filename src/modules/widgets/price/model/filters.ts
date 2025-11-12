import { IconIds } from '@/shared/ui/icon';
import { MarketType } from '@/modules/market';

export enum FilterType {
	MarketTrend = 'trend',
	RankingAndNew = 'rank',
	Sector = 'sector',
	TimeRange = 'range',
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
	[MarketType.Crypto]: [FilterType.RankingAndNew, FilterType.TimeRange],
	[MarketType.Stock]: [FilterType.MarketTrend, FilterType.TimeRange],
	[MarketType.Forex]: [FilterType.TimeRange],
	[MarketType.Commodities]: [FilterType.Sector, FilterType.TimeRange],
	[MarketType.Indices]: [FilterType.TimeRange],
};

export const filterTypeToValue: Record<FilterType, FilterValue[]> = {
	[FilterType.MarketTrend]: Object.values(MarketTrendFilterValue),
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
	[TimeRangeFilterValue.Day]: { label: '1D', value: '1D' },
	[TimeRangeFilterValue.Week]: { label: '1W', value: '1W' },
	[TimeRangeFilterValue.Month]: { label: '1M', value: '1M' },
	[TimeRangeFilterValue.ThreeMonths]: { label: '3M', value: '3M' },
	[TimeRangeFilterValue.SixMonths]: { label: '6M', value: '6M' },
	[TimeRangeFilterValue.Year]: { label: '1Y', value: '1Y' },
};

export const filterTypeToName: Record<FilterType, string> = {
	[FilterType.MarketTrend]: 'Market Trend',
	[FilterType.RankingAndNew]: 'Ranking & New',
	[FilterType.Sector]: 'Sector',
	[FilterType.TimeRange]: 'Time Range',
};

export type FiltersValues = Partial<Record<FilterType, IFilterDisplay[]>>;
export type FiltersState = Partial<Record<FilterType, FilterValue>>;
