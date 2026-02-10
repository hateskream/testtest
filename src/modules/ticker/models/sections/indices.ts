import { type ITickerWidgetSections } from './sections';

export const tickerIndicesSections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'INDEX_OVERVIEW',
			height: 215,
		},
	],
	center: [],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'INDEX_INSIGHTS_AND_ACTIVITY',
			height: 215,
		},
	],
} as const satisfies ITickerWidgetSections;
