import type { DateRangePresetType } from '@/modules/lightweight-charts/model';
import { createPreset, DateRangePreset } from '@/modules/lightweight-charts/model';

export interface IFilterDisplay {
	label: string;
	value: string;
	option: string;
}

export const filterValueToDisplay = {
	[DateRangePreset.Day]: { label: '1D', value: DateRangePreset.Day, option: '1 day' },
	[DateRangePreset.Week]: { label: '1W', value: DateRangePreset.Week, option: '1 week' },
	[DateRangePreset.Month]: { label: '1M', value: DateRangePreset.Month, option: '1 month' },
	[DateRangePreset.SixMonths]: { label: '6M', value: DateRangePreset.SixMonths, option: '6 months' },
	[DateRangePreset.Year]: { label: '1Y', value: DateRangePreset.Year, option: '1 year' },
	[DateRangePreset.All]: { label: 'All', value: DateRangePreset.All, option: 'All time' },
} as const satisfies Record<DateRangePresetType, IFilterDisplay>;

export function getDefaultDateRange() {
	return createPreset(DateRangePreset.Day);
}
