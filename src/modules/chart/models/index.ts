import type { IconIds } from '@/shared/ui/icon';
import {
	ChartSectionDailyNetFlows,
	ChartSectionDividends,
	ChartSectionDividendsAndCapitalGains,
	ChartSectionFinancials,
	ChartSectionHoldingsEtf,
	ChartSectionInsiderTrading,
	ChartSectionInsightAndActivity,
	ChartSectionPeerAnalysis,
	ChartSectionPortfolioComposition,
	ChartSectionPriceEarnings,
	ChartSectionPricePerformance,
	ChartSectionSeasonals,
	ChartSectionSnp,
	ChartSectionTechnicals,
	ChartSectionTop10Weight,
	ChartSectionValuationsAndEstimates,
	SectionHoldings,
	SectionHoldingsDigram,
	SectionTrailingReturns,
	SectionTransactions,
} from '@/modules/chart/components/sections';

export * from './candle';

export enum TickerType {
	CRYPTO = 'crypto',
	STOCK = 'stock',
	FOREX = 'forex',
	COMMODITIES = 'commodities',
	INDICES = 'indices',
	ETF = 'etf',
}


// Define enum for chart section components
export enum CHART_SECTION_COMPONENT {
	INSIGHT_AND_ACTIVITY = 'INSIGHT_AND_ACTIVITY',
	VALUATIONS_AND_ESTIMATES = 'VALUATIONS_AND_ESTIMATES',
	PEER_ANALYSIS = 'PEER_ANALYSIS',
	INSIDER_TRADING = 'INSIDER_TRADING',
	DIVIDENDS = 'DIVIDENDS',
	FINANCIALS = 'FINANCIALS',
	PRICE_PERFORMANCE = 'PRICE_PERFORMANCE',
	PRICE_EARNINGS = 'PRICE_EARNINGS',
	TECHNICALS = 'TECHNICALS',
	HOLDINGS = 'HOLDINGS',
	TRANSACTIONS = 'TRANSACTIONS',
	DAILY_NET_FLOWS = 'DAILY_NET_FLOWS',
	DIVIDENDS_AND_CAPITAL_GAINS = 'DIVIDENDS_AND_CAPITAL_GAINS',
	HOLDINGS_ETF = 'HOLDINGS_ETF',
	PORTFOLIO_COMPOSITION = 'PORTFOLIO_COMPOSITION',
	TRAILING_RETURNS = 'TRAILING_RETURNS',
	HOLDINGS_DIAGRAM = 'HOLDINGS_DIAGRAM',
	SNP_500 = 'SNP_500',
	SEASONALS = 'SEASONALS',
	TOP10_WEIGHTS = 'TOP10_WEIGHTS',
}

// Create mapping from enum to actual components
export const CHART_COMPONENT_MAP = {
	[CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY]: ChartSectionInsightAndActivity,
	[CHART_SECTION_COMPONENT.VALUATIONS_AND_ESTIMATES]: ChartSectionValuationsAndEstimates,
	[CHART_SECTION_COMPONENT.PEER_ANALYSIS]: ChartSectionPeerAnalysis,
	[CHART_SECTION_COMPONENT.INSIDER_TRADING]: ChartSectionInsiderTrading,
	[CHART_SECTION_COMPONENT.DIVIDENDS]: ChartSectionDividends,
	[CHART_SECTION_COMPONENT.FINANCIALS]: ChartSectionFinancials,
	[CHART_SECTION_COMPONENT.PRICE_PERFORMANCE]: ChartSectionPricePerformance,
	[CHART_SECTION_COMPONENT.PRICE_EARNINGS]: ChartSectionPriceEarnings,
	[CHART_SECTION_COMPONENT.TECHNICALS]: ChartSectionTechnicals,
	[CHART_SECTION_COMPONENT.HOLDINGS]: SectionHoldings,
	[CHART_SECTION_COMPONENT.TRANSACTIONS]: SectionTransactions,
	[CHART_SECTION_COMPONENT.DAILY_NET_FLOWS]: ChartSectionDailyNetFlows,
	[CHART_SECTION_COMPONENT.DIVIDENDS_AND_CAPITAL_GAINS]: ChartSectionDividendsAndCapitalGains,
	[CHART_SECTION_COMPONENT.HOLDINGS_ETF]: ChartSectionHoldingsEtf,
	[CHART_SECTION_COMPONENT.PORTFOLIO_COMPOSITION]: ChartSectionPortfolioComposition,
	[CHART_SECTION_COMPONENT.TRAILING_RETURNS]: SectionTrailingReturns,
	[CHART_SECTION_COMPONENT.HOLDINGS_DIAGRAM]: SectionHoldingsDigram,
	[CHART_SECTION_COMPONENT.SNP_500]: ChartSectionSnp,
	[CHART_SECTION_COMPONENT.SEASONALS]: ChartSectionSeasonals,
	[CHART_SECTION_COMPONENT.TOP10_WEIGHTS]: ChartSectionTop10Weight,
} as const;

export type ChartComponentType = typeof CHART_COMPONENT_MAP[keyof typeof CHART_COMPONENT_MAP];

export interface IWidgetItem {
	id: string;
	title: string;
	group?: string;
	component?: CHART_SECTION_COMPONENT;
}

export interface ISectionItem {
	id: string;
	title: string;
	items?: IWidgetItem[];
	component?: CHART_SECTION_COMPONENT;
}

export interface ISectionProps {
	section: ISectionItem;
	selectedItem?: string | null;
	registerItemRef: (itemId: string, element: HTMLElement | null) => void;
}

export interface IPeriodData {
	min: number;
	max: number;
	current: number;
	start: number;
	symbol: string;
}

export interface IAllTimeData {
	high: {
		value: number;
		date: string;
		percentage: number;
	};
	low: {
		value: number;
		date: string;
		percentage: number;
	};
}

export interface IExchange {
	id: number;
	source: string;
	fullName: string;
	symbol: string;
	currency: string;
	currency_symbol: string;
	displaySymbol: string;
	isPrimary: boolean;
	price: number;
	change: {
		points: number;
		percentage: number;
	};
	openTime: string;
	closeTime: string;
	iconId: IconIds;
	periods: {
		'1D': IPeriodData;
		'1W': IPeriodData;
		'1M': IPeriodData;
		'3M': IPeriodData;
		'1Y': IPeriodData;
	};
	allTime: IAllTimeData;
}

export interface IPriceRange {
	min: number;
	max: number;
}

export interface IChartWidgetSections {
	left: ISectionItem[];
	center: ISectionItem[];
	right: ISectionItem[];
}

export const getChartComponent = (componentType: CHART_SECTION_COMPONENT): ChartComponentType => {
	return CHART_COMPONENT_MAP[componentType];
};

export const chartStockSections: IChartWidgetSections = {
	left: [
		{
			id: 'price-performance',
			title: 'Performance',
			component: CHART_SECTION_COMPONENT.PRICE_PERFORMANCE,
		},
		{
			id: 'explorer',
			title: 'Explorer',
		},
	],
	center: [
		{
			id: 'valuation-and-estimates',
			title: 'Valuation and estimates',
			component: CHART_SECTION_COMPONENT.VALUATIONS_AND_ESTIMATES,
			items: [
				{
					id: 'valuation-metrics',
					title: 'Valuation Metrics',
				},
				{
					id: 'capital-structure',
					title: 'Capital Structure',
				},
				{
					id: 'price-target-history',
					title: 'Price Target History',
					group: 'tab-group-1',
				},
				{
					id: 'price-target-analysis',
					title: 'Price Target Analysis',
					group: 'tab-group-1',
				},
				{
					id: 'quarterly-revenue',
					title: 'Quarterly revenue',
					group: 'tab-group-2',
				},
				{
					id: 'yearly-revenue',
					title: 'Yearly revenue',
					group: 'tab-group-2',
				},
				{
					id: 'analyst-ratings',
					title: 'Analyst Rating',
				},
			],
		},
		{
			id: 'price-earnings',
			title: 'Price Earnings',
			component: CHART_SECTION_COMPONENT.PRICE_EARNINGS,
			items: [
				{
					id: 'price-earnings',
					title: 'P/E',
				},
				{ id:'earning-per-share', title: 'EPS' },
				{ id: 'historical-eps', title: 'Historical EPS' },

			],
		},
		{
			id: 'financials',
			title: 'Financials',
			component: CHART_SECTION_COMPONENT.FINANCIALS,
			items: [
				{
					id: 'balance-sheet',
					title: 'Balance Sheet',
				},
				{
					id: 'income-statement',
					title: 'Income Statement',
				},
				{
					id: 'annual-returns',
					title: 'Annual Returns',
				},
				{
					id: 'annual-margin-trends',
					title: 'Annual Margin Trends',
				},

			],
		},
		{
			id: 'insider-trading',
			title: 'Insider trading',
			component: CHART_SECTION_COMPONENT.INSIDER_TRADING,
			items: [
				{
					id: 'recent-activity',
					title: 'Recent Activity',
				},
				{
					id: 'trading-volume',
					title: 'Trading Volume',
				},
			],
		},
		{
			id: 'dividends',
			title: 'Dividends',
			component: CHART_SECTION_COMPONENT.DIVIDENDS,
		},
		{
			id: 'peer-analysis',
			title: 'Peer analysis',
			component: CHART_SECTION_COMPONENT.PEER_ANALYSIS,
			items: [
				{
					id: 'top-peers',
					title: 'Top Peers',
				},
				{
					id: 'stock-peers-bulks',
					title: 'Stock Peers Bulks',
				},
			],
		},
	],
	right: [
		{
			id: 'insight-and-activity',
			title: 'Insight',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;

export const chartCryptoSections: IChartWidgetSections = {
	left: [
		{
			id: 'price-performance',
			title: 'Price performance',
			component: CHART_SECTION_COMPONENT.PRICE_PERFORMANCE,
		},
		{
			id: 'explorer',
			title: 'Explorer',
		},
	],
	center: [
		{
			id: 'technicals',
			title: 'Technicals',
			component: CHART_SECTION_COMPONENT.TECHNICALS,
			items: [
				{
					id: 'oscillators',
					title: 'Oscillators',
					group: 'tab-group-1',
				},
				{
					id: 'moving-averages',
					title: 'Moving Averages',
					group: 'tab-group-1',
				},
			],
		},
		{
			id:'seasonals',
			title: 'Seasonals',
			component: CHART_SECTION_COMPONENT.SEASONALS,
		},
		{
			id: 'holdings',
			title: 'Holdings',
			component: CHART_SECTION_COMPONENT.HOLDINGS,
		},
		{
			id: 'transactions',
			title: 'Transactions',
			component: CHART_SECTION_COMPONENT.TRANSACTIONS,
		},
	],
	right: [
		{
			id: 'insight-and-activity',
			title: 'Insights and activity',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;

export const chartForexSections: IChartWidgetSections = {
	left: [
		{
			id: 'price-performance',
			title: 'Performance',
			component: CHART_SECTION_COMPONENT.PRICE_PERFORMANCE,
		},
		{
			id: 'explorer',
			title: 'Explorer',
		},
	],
	center: [],
	right: [
		{
			id: 'insight-and-activity',
			title: 'Insight',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;

export const chartCommoditiesSections: IChartWidgetSections = {
	left: [
		{
			id: 'price-performance',
			title: 'Performance',
			component: CHART_SECTION_COMPONENT.PRICE_PERFORMANCE,
		},
		{
			id: 'explorer',
			title: 'Explorer',
		},
	],
	center: [],
	right: [
		{
			id: 'insight-and-activity',
			title: 'Insight',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;

export const chartIndicesSections: IChartWidgetSections = {
	left: [
		{
			id: 'price-performance',
			title: 'Performance',
			component: CHART_SECTION_COMPONENT.PRICE_PERFORMANCE,
		},
		{
			id: 'explorer',
			title: 'Explorer',
		},
	],
	center: [],
	right: [
		{
			id: 'insight-and-activity',
			title: 'Insight',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;

export const chartEtfSections: IChartWidgetSections = {
	left: [
		{
			id: 'price-performance',
			title: 'Performance',
			component: CHART_SECTION_COMPONENT.PRICE_PERFORMANCE,
		},
		{
			id: 'explorer',
			title: 'Explorer',
		},
	],
	center: [
		{
			id: 'trailing-returns',
			title: 'Trailing Returns',
			component: CHART_SECTION_COMPONENT.TRAILING_RETURNS,
		},
		{
			id: 'dividends-and-capital-gains',
			title: 'Dividends & Capital Gains',
			component: CHART_SECTION_COMPONENT.DIVIDENDS_AND_CAPITAL_GAINS,
		},
		{
			id: 'holdings-etf',
			title: 'Holdings Summary',
			component: CHART_SECTION_COMPONENT.HOLDINGS_ETF,
		},
		{
			id: 'top10-weights',
			title: 'Top 10 Weights',
			component: CHART_SECTION_COMPONENT.TOP10_WEIGHTS,
		},
		{
			id: 'portfolio-composition',
			title: 'Portfolio Composition',
			component: CHART_SECTION_COMPONENT.PORTFOLIO_COMPOSITION,
		},
		{
			id: 'holdings-diagram',
			title: 'Holdings Summary',
			component: CHART_SECTION_COMPONENT.HOLDINGS_DIAGRAM,
		},

		{
			id: 'snp-500',
			title: 'SNP 500',
			component: CHART_SECTION_COMPONENT.SNP_500,
		},
		{
			id: 'daily-net-flows',
			title: 'Daily net flows',
			component: CHART_SECTION_COMPONENT.DAILY_NET_FLOWS,
		},
	],
	right: [
		{
			id: 'insight-and-activity',
			title: 'Insight',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;

export const CHART_SECTIONS_BY_TYPE = {
	[TickerType.STOCK]: chartStockSections,
	[TickerType.CRYPTO]: chartCryptoSections,
	[TickerType.FOREX]: chartForexSections,
	[TickerType.COMMODITIES]: chartCommoditiesSections,
	[TickerType.INDICES]: chartIndicesSections,
	[TickerType.ETF]: chartEtfSections,
} as const;

export const getChartSectionsByType = (tickerType: TickerType): IChartWidgetSections => {
	return CHART_SECTIONS_BY_TYPE[tickerType];
};
