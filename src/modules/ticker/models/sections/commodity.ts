import { type ITickerWidgetSections } from './sections';

export const tickerCommoditySections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'COMMODITY_OVERVIEW',
			height: {
				desktop: 327,
				tablet: 504,
				mobile: 504,
			},
		},
	],
	center: [],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'COMMODITY_INSIGHTS_AND_ACTIVITY',
			height: {
				desktop: 327,
				tablet: 504,
				mobile: 69,
			},
		},
	],
} as const satisfies ITickerWidgetSections;
