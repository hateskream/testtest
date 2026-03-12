import { type ITickerWidgetSections } from './sections';

export const tickerStockSections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'STOCK_OVERVIEW',
			height: 350,
		},
	],
	center: [
		{
			id: 'valuation',
			title: 'Valuation & Estimates',
			component: 'STOCK_VALUATION_AND_ESTIMATES',
			height: 350,
		},
		{
			id: 'financials',
			title: 'Financials',
			component: 'STOCK_FINANSIALS',
			height: 350,
		},
	],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'STOCK_INSIGHTS_AND_ACTIVITY',
			height: 1000,
		},
	],
} as const satisfies ITickerWidgetSections;
