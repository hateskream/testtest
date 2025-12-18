import { CpiRange, CpiValueType } from './cpi';

export const rangeFilterValueToDisplay: Record<CpiRange, { selected: string; option: string }> = {
	[CpiRange.Year]: {
		selected: '1Y',
		option: '1 year',
	},
	[CpiRange.ThreeYears]: {
		selected: '3Y',
		option: '3 years',
	},
	[CpiRange.FiveYears]: {
		selected: '5Y',
		option: '5 years',
	},
	[CpiRange.TenYears]: {
		selected: '10Y',
		option: '10 years',
	},
	[CpiRange.All]: {
		selected: 'All',
		option: 'All time',
	},
};

export const rangeFilters = Object.entries(rangeFilterValueToDisplay)
	.map(([value, option]) => ({ label: option.option, value: value as CpiRange }));


export const valueTypeFilterValueToDisplay: Record<CpiValueType, string> = {
	[CpiValueType.Points]: 'Points',
	[CpiValueType.ChangeDelta]: 'Change',
	[CpiValueType.ChangePercent]: 'Change, %',
};

export const valueTypeFilters = Object.entries(valueTypeFilterValueToDisplay)
	.map(([value, label]) => ({ label, value: value as CpiValueType }));

