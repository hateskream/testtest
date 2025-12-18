import { RealGdpRange } from './real-gdp';

export const rangeFilterValueToDisplay: Record<RealGdpRange, { selected: string; option: string }> = {
	[RealGdpRange.FiveYears]: {
		selected: '5Y',
		option: '5 years',
	},
	[RealGdpRange.TenYears]: {
		selected: '10Y',
		option: '10 years',
	},
	[RealGdpRange.TwentyFiveYears]: {
		selected: '25Y',
		option: '25 years',
	},
	[RealGdpRange.All]: {
		selected: 'All',
		option: 'All time',
	},
};

export const rangeFilters = Object.entries(rangeFilterValueToDisplay)
	.map(([value, option]) => ({ label: option.selected, value: value as RealGdpRange }));
