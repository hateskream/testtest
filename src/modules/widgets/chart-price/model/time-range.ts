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
	option: string;
}

export const filterValueToDisplay: Record<TimeRangeFilterValue, IFilterDisplay> = {
	[TimeRangeFilterValue.Day]: { label: '1D', value: '1D', option: '1 day' },
	[TimeRangeFilterValue.Week]: { label: '1W', value: '1W', option: '1 week' },
	[TimeRangeFilterValue.Month]: { label: '1M', value: '1M', option: '1 month' },
	[TimeRangeFilterValue.SixMonths]: { label: '6M', value: '6M', option: '6 months' },
	[TimeRangeFilterValue.Year]: { label: '1Y', value: '1Y', option: '1 year' },
	[TimeRangeFilterValue.All]: { label: 'All', value: 'ALL', option: 'All time' },
};
