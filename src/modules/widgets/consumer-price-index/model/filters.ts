import { CpiMetric, CpiRange } from './cpi';

export const rangeFilterValueToDisplay: Record<CpiRange, { selected: string; option: string }> = {
	[CpiRange.Year]: {
		selected: '1Y',
		option: 'Year',
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

export const metricFilterValueToDisplay: Record<CpiMetric, string> = {
	[CpiMetric.Points]: 'Points',
	[CpiMetric.ChangeDelta]: 'Change',
	[CpiMetric.ChangePercent]: 'Change, %',
};
