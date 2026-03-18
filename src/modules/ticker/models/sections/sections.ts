import { isFeatureEnabled } from '@/shared/lib';
import { TickerType } from '../ticker';
import { tickerStockSections } from './stock';
import { getForexTickerSections } from './forex';
import { tickerCryptoSections } from './crypto.ts';
import { tickerCommoditySections } from './commodity.ts';
import { tickerIndicesSections } from './indices.ts';
import { tickerEtfSections } from './etf.ts';

export const TICKER_SECTION_COMPONENT = {
	// forex
	FOREX_OVERVIEW: 'FOREX_OVERVIEW',
	US_MACROECONOMIC_INDICATORS: 'US_MACROECONOMIC_INDICATORS',
	FOREX_INSIGHTS_AND_ACTIVITY: 'FOREX_INSIGHTS_AND_ACTIVITY',

	// stock
	STOCK_OVERVIEW: 'STOCK_OVERVIEW',
	STOCK_VALUATION_AND_ESTIMATES: 'STOCK_VALUATION_AND_ESTIMATES',
	STOCK_INSIGHTS_AND_ACTIVITY: 'STOCK_INSIGHTS_AND_ACTIVITY',
	STOCK_EARNINGS: 'STOCK_EARNINGS',
	STOCK_FINANCIALS: 'STOCK_FINANSIALS',
	STOCK_INSIDER_TRADING: 'STOCK_INSIDER_TRADING',

	// crypto
	CRYPTO_OVERVIEW: 'CRYPTO_OVERVIEW',
	CRYPTO_INSIGHTS_AND_ACTIVITY: 'CRYPTO_INSIGHTS_AND_ACTIVITY',
	CRYPTO_SEASONALS: 'CRYPTO_SEASONALS',
	CRYPTO_HOLDINGS: 'CRYPTO_HOLDINGS',

	// etf
	ETF_OVERVIEW: 'ETF_OVERVIEW',
	ETF_INSIGHTS_AND_ACTIVITY: 'ETF_INSIGHTS_AND_ACTIVITY',
	ETF_VALUATION_AND_ESTIMATES: 'ETF_VALUATION_AND_ESTIMATES',
	ETF_HOLDING_SUMMARY: 'ETF_HOLDING_SUMMARY',

	// index
	INDEX_OVERVIEW: 'INDEX_OVERVIEW',
	INDEX_INSIGHTS_AND_ACTIVITY: 'INDEX_INSIGHTS_AND_ACTIVITY',
	INDEX_HOLDING_SUMMARY: 'INDEX_HOLDING_SUMMARY',

	// commodity
	COMMODITY_OVERVIEW: 'COMMODITY_OVERVIEW',
	COMMODITY_INSIGHTS_AND_ACTIVITY: 'COMMODITY_INSIGHTS_AND_ACTIVITY',
} as const;

export type TickerSectionComponent =
	typeof TICKER_SECTION_COMPONENT[keyof typeof TICKER_SECTION_COMPONENT];

export interface ISectionItemHeightConfig {
	desktop: number;
	tablet: number;
	mobile: number;
}

export interface ISectionItem {
	id: string;
	title: string;
	component: TickerSectionComponent;
	height: number | ISectionItemHeightConfig;
}

export interface ITickerWidgetSections {
	left: ISectionItem[];
	center: ISectionItem[];
	right: ISectionItem[];
}

export const TICKER_SECTIONS_BY_TYPE = {
	[TickerType.STOCK]: () => tickerStockSections,
	[TickerType.CRYPTO]: () => tickerCryptoSections,
	[TickerType.FOREX]: getForexTickerSections,
	[TickerType.COMMODITIES]: () => tickerCommoditySections,
	[TickerType.INDICES]: () => tickerIndicesSections,
	[TickerType.ETF]: () => tickerEtfSections,
} as const satisfies Record<TickerType, (tickerId: string) => ITickerWidgetSections>;

const experimentalSections = {
	[TICKER_SECTION_COMPONENT.INDEX_INSIGHTS_AND_ACTIVITY]: () =>
		isFeatureEnabled('TICKER_WIDGET_INDICATORS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_ACTIVITY_METRICS_ENABLED'),
	[TICKER_SECTION_COMPONENT.CRYPTO_INSIGHTS_AND_ACTIVITY]: () =>
		isFeatureEnabled('TICKER_WIDGET_INDICATORS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_ACTIVITY_METRICS_ENABLED'),
	[TICKER_SECTION_COMPONENT.ETF_INSIGHTS_AND_ACTIVITY]: () =>
		isFeatureEnabled('TICKER_WIDGET_INDICATORS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_ACTIVITY_METRICS_ENABLED'),
	[TICKER_SECTION_COMPONENT.FOREX_INSIGHTS_AND_ACTIVITY]: () =>
		isFeatureEnabled('TICKER_WIDGET_INDICATORS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_ACTIVITY_METRICS_ENABLED'),
	[TICKER_SECTION_COMPONENT.COMMODITY_INSIGHTS_AND_ACTIVITY]: () =>
		isFeatureEnabled('TICKER_WIDGET_INDICATORS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_ACTIVITY_METRICS_ENABLED'),
	[TICKER_SECTION_COMPONENT.STOCK_INSIGHTS_AND_ACTIVITY]: () =>
		isFeatureEnabled('TICKER_WIDGET_INDICATORS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_ACTIVITY_METRICS_ENABLED'),
	[TICKER_SECTION_COMPONENT.US_MACROECONOMIC_INDICATORS]: () =>
		isFeatureEnabled('TICKER_WIDGET_US_INFLATION_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_FEDERAL_FUNDS_ENABLED'),
	[TICKER_SECTION_COMPONENT.STOCK_OVERVIEW]: () =>
		isFeatureEnabled('TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED'),
	[TICKER_SECTION_COMPONENT.FOREX_OVERVIEW]: () =>
		isFeatureEnabled('TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED'),
	[TICKER_SECTION_COMPONENT.CRYPTO_OVERVIEW]: () =>
		isFeatureEnabled('TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED'),
	[TICKER_SECTION_COMPONENT.ETF_OVERVIEW]: () =>
		isFeatureEnabled('TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED'),
	[TICKER_SECTION_COMPONENT.INDEX_OVERVIEW]: () =>
		isFeatureEnabled('TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED'),
	[TICKER_SECTION_COMPONENT.COMMODITY_OVERVIEW]: () =>
		isFeatureEnabled('TICKER_WIDGET_PRICE_PERFORMANCE_ENABLED'),
	[TICKER_SECTION_COMPONENT.CRYPTO_SEASONALS]: () =>
		isFeatureEnabled('TICKER_WIDGET_SEASONALS_ENABLED'),
	[TICKER_SECTION_COMPONENT.STOCK_VALUATION_AND_ESTIMATES]: () =>
		isFeatureEnabled('TICKER_WIDGET_ANALYST_RATINGS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_VALUATION_METRICS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_CAPITAL_STRUCTURE_ENABLED'),
	[TICKER_SECTION_COMPONENT.ETF_VALUATION_AND_ESTIMATES]: () =>
		isFeatureEnabled('TICKER_WIDGET_VALUATION_METRICS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_CAPITAL_STRUCTURE_ENABLED'),
	[TICKER_SECTION_COMPONENT.STOCK_FINANCIALS]: () =>
		isFeatureEnabled('TICKER_WIDGET_ANNUAL_RETURNS_ENABLED'),
	[TICKER_SECTION_COMPONENT.CRYPTO_HOLDINGS]: () =>
		isFeatureEnabled('TICKER_WIDGET_ADDRESSES_BY_HOLDINGS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_WHALE_HOLDINGS_ENABLED'),
	[TICKER_SECTION_COMPONENT.INDEX_HOLDING_SUMMARY]: () =>
		isFeatureEnabled('TICKER_WIDGET_SECTORS_ENABLED'),
	[TICKER_SECTION_COMPONENT.ETF_HOLDING_SUMMARY]: () =>
		isFeatureEnabled('TICKER_WIDGET_SECTORS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_SECTORS_ANALYSIS_ENABLED') ||
		isFeatureEnabled('TICKER_WIDGET_HOLDINGS_DIAGRAM_ENABLED'),
	[TICKER_SECTION_COMPONENT.STOCK_EARNINGS]: () =>
		isFeatureEnabled('TICKER_WIDGET_PRICE_TO_EARNINGS_ENABLED'),
	[TICKER_SECTION_COMPONENT.STOCK_INSIDER_TRADING]: () =>
		isFeatureEnabled('TICKER_WIDGET_TRADING_VOLUME_ENABLED'),
} as const satisfies Partial<Record<TickerSectionComponent, () => boolean>>;

function hasExperimentalSection(key: TickerSectionComponent): key is keyof typeof experimentalSections {
	return key in experimentalSections;
}

function filterExperimentalSections(sections: ISectionItem[]) {
	return sections.filter(section => {
		if (hasExperimentalSection(section.component)) {
			return experimentalSections[section.component]();
		}

		return true;
	});
}

export function getChartSectionsByTicker(options: { tickerType: TickerType; tickerId: string }): ITickerWidgetSections {
	const block = TICKER_SECTIONS_BY_TYPE[options.tickerType](options.tickerId);

	return {
		left: filterExperimentalSections(block.left),
		center: filterExperimentalSections(block.center),
		right: filterExperimentalSections(block.right),
	};
}
