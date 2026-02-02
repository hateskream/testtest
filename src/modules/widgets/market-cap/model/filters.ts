import { DateRangePreset, type DateRangePresetType } from '@/modules/lightweight-charts/model';

export const dateRangeFilterValueToDisplay = {
	[DateRangePreset.Day]: {
		selected: '1D',
		option: '1 day',
	},
	[DateRangePreset.Week]: {
		selected: '1W',
		option: '1 week',
	},
	[DateRangePreset.Month]: {
		selected: '1M',
		option: '1 month',
	},
	[DateRangePreset.SixMonths]: {
		selected: '6M',
		option: '6 months',
	},
	[DateRangePreset.Year]: {
		selected: '1Y',
		option: '1 year',
	},
	[DateRangePreset.All]: {
		selected: 'All',
		option: 'All time',
	},
} as const satisfies Record<DateRangePresetType, { selected: string; option: string }>;

export const dateRangeFilters = Object.values(DateRangePreset).map(d => {
	return {
		label: dateRangeFilterValueToDisplay[d].selected,
		value: d,
	} as const;
}) as const;
