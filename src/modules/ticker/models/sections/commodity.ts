import { type ITickerWidgetSections } from './sections';

export const tickerCommoditySections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'COMMODITY_OVERVIEW',
			height: 210,
		},
	],
	center: [],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'COMMODITY_INSIGHTS_AND_ACTIVITY',
			height: 210,
		},
	],
} as const satisfies ITickerWidgetSections;
