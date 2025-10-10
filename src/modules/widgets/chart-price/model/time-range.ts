export enum TimeRangeFilterValue {
	Day = '1D',
	Week = '1W',
	Month = '1M',
	ThreeMonths = '3M',
	SixMonths = '6M',
	Year = '1Y',
}

export interface IFilterDisplay {
	label: string;
	value: string;
}

export const filterValueToDisplay: Record<TimeRangeFilterValue, IFilterDisplay> = {
	[TimeRangeFilterValue.Day]: { label: '1D', value: '1D' },
	[TimeRangeFilterValue.Week]: { label: '1W', value: '1W' },
	[TimeRangeFilterValue.Month]: { label: '1M', value: '1M' },
	[TimeRangeFilterValue.ThreeMonths]: { label: '3M', value: '3M' },
	[TimeRangeFilterValue.SixMonths]: { label: '6M', value: '6M' },
	[TimeRangeFilterValue.Year]: { label: '1Y', value: '1Y' },
};
