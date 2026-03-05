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
	center: [
		{
			id: 'valuation',
			title: 'Valuation & Estimates',
			component: 'ETF_VALUATION_AND_ESTIMATES',
			height: 300,
		},
	],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'ETF_INSIGHTS_AND_ACTIVITY',
			height: 1100,
		},
	],
} as const satisfies ITickerWidgetSections;
