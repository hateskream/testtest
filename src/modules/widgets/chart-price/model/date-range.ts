import type { DateRangePresetType } from '@/modules/charts/common/model';
import { createPreset, DateRangePreset } from '@/modules/charts/common/model';

export interface IFilterDisplay {
	label: string;
	value: string;
	option: string;
}

export const ChartPriceDateRangePreset = {
	Day: DateRangePreset.Day,
	Week: DateRangePreset.Week,
	Month: DateRangePreset.Month,
	SixMonths: DateRangePreset.SixMonths,
	Year: DateRangePreset.Year,
	All: DateRangePreset.All,
} as const satisfies Record<string, DateRangePresetType>;

export type ChartPriceDateRangePresetType = typeof ChartPriceDateRangePreset[keyof typeof ChartPriceDateRangePreset];

export const filterValueToDisplay = {
	[ChartPriceDateRangePreset.Day]: { label: '1D', value: ChartPriceDateRangePreset.Day, option: '1 day' },
	[ChartPriceDateRangePreset.Week]: { label: '1W', value: ChartPriceDateRangePreset.Week, option: '1 week' },
	[ChartPriceDateRangePreset.Month]: { label: '1M', value: ChartPriceDateRangePreset.Month, option: '1 month' },
	[ChartPriceDateRangePreset.SixMonths]: {
		label: '6M', value: ChartPriceDateRangePreset.SixMonths, option: '6 months',
	},
	[ChartPriceDateRangePreset.Year]: { label: '1Y', value: ChartPriceDateRangePreset.Year, option: '1 year' },
	[ChartPriceDateRangePreset.All]: { label: 'All', value: ChartPriceDateRangePreset.All, option: 'All time' },
} as const satisfies Record<ChartPriceDateRangePresetType, IFilterDisplay>;

export function getDefaultDateRange() {
	return createPreset(DateRangePreset.Day);
}
