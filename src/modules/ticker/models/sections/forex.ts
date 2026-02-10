import { type ITickerWidgetSections } from './sections';
import { decodeTickerId } from '@/modules/cell';

export const tickerCommonForexSections = {
	left: [
		{
			id: 'insights',
			title: 'Overview',
			component: 'FOREX_OVERVIEW',
			height: 360,
		},
	],
	center: [],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'FOREX_INSIGHTS_AND_ACTIVITY',
			height: 750,
		},
	],
} as const satisfies ITickerWidgetSections;

export const tickerUsForexSections = {
	left: [
		{
			id: 'insights',
			title: 'Overview',
			component: 'FOREX_OVERVIEW',
			height: 360,
		},
	],
	center: [
		{
			id: 'macroeconomic',
			title: 'US Macroeconomic indicators',
			component: 'US_MACROECONOMIC_INDICATORS',
			height: 550,
		},
	],
	right: [
		{
			id: 'insights',
			title: 'Insights & Activity',
			component: 'FOREX_INSIGHTS_AND_ACTIVITY',
			height: 750,
		},
	],
} as const satisfies ITickerWidgetSections;

function isUsdForexTicker(canonicalTickerId: string) {
	const decodedTicker = decodeTickerId(canonicalTickerId);

	if (!decodedTicker) {
		return false;
	}

	const currencies = decodedTicker.tickerId.split('_');
	return currencies.includes('USD');
}

export const getForexTickerSections = (
	tickerId: string,
): ITickerWidgetSections => {
	if (isUsdForexTicker(tickerId)) {
		return tickerUsForexSections;
	}

	return tickerCommonForexSections;
};
