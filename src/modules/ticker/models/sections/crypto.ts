import { type ITickerWidgetSections } from './sections';

export const tickerCryptoSections = {
	left: [
		{
			id: 'overview',
			title: 'Overview',
			component: 'CRYPTO_OVERVIEW',
			height: 265,
		},
	],
	center: [
		{
			id: 'holdings',
			title: 'Holdings',
			component: 'CRYPTO_HOLDINGS',
			height: 250,
		},
	],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'CRYPTO_INSIGHTS_AND_ACTIVITY',
			height: 1050,
		},
	],
} as const satisfies ITickerWidgetSections;
