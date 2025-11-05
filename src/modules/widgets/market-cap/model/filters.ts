import { MarketCapDateRange } from './market-cap';

export const dateRangeFilterValueToDisplay: Record<MarketCapDateRange, { selected: string; option: string }> = {
	[MarketCapDateRange.Day]: {
		selected: '1D',
		option: '1 day',
	},
	[MarketCapDateRange.Week]: {
		selected: '1W',
		option: '1 week',
	},
	[MarketCapDateRange.Month]: {
		selected: '1M',
		option: '1 month',
	},
	[MarketCapDateRange.SixMonths]: {
		selected: '6M',
		option: '6 months',
	},
	[MarketCapDateRange.Year]: {
		selected: '1Y',
		option: 'Year',
	},
	[MarketCapDateRange.All]: {
		selected: 'All',
		option: 'All time',
	},
};
