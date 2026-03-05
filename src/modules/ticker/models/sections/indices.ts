import { type ITickerWidgetSections } from './sections';

export const tickerIndicesSections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'INDEX_OVERVIEW',
			height: {
				desktop: 259,
				tablet: 504,
				mobile: 69,
			},
		},
	],
	center: [
		{
			id: 'holding-summary',
			title: 'Holdings Summary',
			component: 'ETF_HOLDING_SUMMARY',
			height: 1100,
		},
	],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'INDEX_INSIGHTS_AND_ACTIVITY',
			height: {
				desktop: 259,
				tablet: 504,
				mobile: 69,
			},
		},
	],
} as const satisfies ITickerWidgetSections;
