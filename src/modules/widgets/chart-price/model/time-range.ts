export enum TimeRangeFilterValue {
	Day = '1D',
	Week = '1W',
	Month = '1M',
	SixMonths = '6M',
	Year = '1Y',
	All = 'ALL',
}

export interface IFilterDisplay {
	label: string;
	value: string;
}

export const filterValueToDisplay: Record<TimeRangeFilterValue, IFilterDisplay> = {
	[TimeRangeFilterValue.Day]: { label: '1 day', value: '1D' },
	[TimeRangeFilterValue.Week]: { label: '1 week', value: '1W' },
	[TimeRangeFilterValue.Month]: { label: '1 month', value: '1M' },
	[TimeRangeFilterValue.SixMonths]: { label: '6 months', value: '6M' },
	[TimeRangeFilterValue.Year]: { label: 'Year', value: '1Y' },
	[TimeRangeFilterValue.All]: { label: 'All time', value: 'ALL' },
};
