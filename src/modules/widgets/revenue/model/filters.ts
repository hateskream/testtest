import { RevenueMode } from './revenue';

export const revenueModeFilters = [
	{ label: 'Quarterly', value: RevenueMode.Quarterly },
	{ label: 'Yearly', value: RevenueMode.Yearly },
] as const;
