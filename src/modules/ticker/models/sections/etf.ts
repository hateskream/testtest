import { type ITickerWidgetSections } from './sections';

export const tickerEtfSections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'ETF_OVERVIEW',
			height: 265,
		},
	],
	center: [],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'ETF_INSIGHTS_AND_ACTIVITY',
			height: 1100,
		},
	],
} as const satisfies ITickerWidgetSections;
