import { NominalGdpRange } from './nominal-gdp';

export const rangeFilterValueToDisplay: Record<NominalGdpRange, { selected: string; option: string }> = {
	[NominalGdpRange.FiveYears]: {
		selected: '5Y',
		option: '5 years',
	},
	[NominalGdpRange.TenYears]: {
		selected: '10Y',
		option: '10 years',
	},
	[NominalGdpRange.TwentyFiveYears]: {
		selected: '25Y',
		option: '25 years',
	},
	[NominalGdpRange.All]: {
		selected: 'All',
		option: 'All time',
	},
};

export const rangeFilters = Object.entries(rangeFilterValueToDisplay)
	.map(([value, option]) => ({ label: option.selected, value: value as NominalGdpRange }));
