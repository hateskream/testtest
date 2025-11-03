import { DominanceDateRange } from './dominance';

export const dateRangeFilterValueToDisplay: Record<DominanceDateRange, string> = {
	[DominanceDateRange.Day]: '24 hours',
	[DominanceDateRange.Week]: '7 days',
	[DominanceDateRange.Month]: '1 month',
	[DominanceDateRange.SixMonths]: '6 months',
	[DominanceDateRange.Year]: '1 year',
	[DominanceDateRange.All]: 'All',
};
