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
			height: 250,
		},
		{
			id: 'holding-summary',
			title: 'Holdings Summary',
			component: 'ETF_HOLDING_SUMMARY',
			height: 750,
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
