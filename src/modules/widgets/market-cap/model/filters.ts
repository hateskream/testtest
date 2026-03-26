import { DateRangePreset, type DateRangePresetType, getDateRangePresetLabel } from '@/modules/charts/common/model';

export const MarketCapDateRangePreset = {
	Day: DateRangePreset.Day,
	Week: DateRangePreset.Week,
	Month: DateRangePreset.Month,
	SixMonths: DateRangePreset.SixMonths,
	Year: DateRangePreset.Year,
	All: DateRangePreset.All,
} as const satisfies Record<string, DateRangePresetType>;

export const dateRangeFilters = Object.values(MarketCapDateRangePreset).map(d => {
	return {
		label: getDateRangePresetLabel(d),
		value: d,
	};
});
