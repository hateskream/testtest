import type { IconIds } from '@/shared/ui/icon';
import {
	ChartSectionInsightAndActivity,
	ChartSectionPriceTarget,
	ChartSectionQuarterlyRevenue,
	ChartSectionValuationsAndEstimates,
	ChartSectionYearlyRevenue,
	ChartSectionPeerAnalysis,
	ChartSectionInsiderTrading,
	ChartSectionEps,
	ChartSectionStockPeersBulk,
	ChartSectionDividends,
	ChartSectionBalanceSheet,
	ChartSectionIncomeStatement,
	ChartSectionPricePerformance,
	ChartSectionPriceEarnings,
	ChartSectionTradingVolume,
	ChartSectionAnnualReturns,
	ChartSectionTechnicals,
	SectionHoldings,
	SectionTransactions,
	ChartSectionAnnualMarginTrends,
} from '@/modules/chart/components/sections';


// Define enum for chart section components
export enum CHART_SECTION_COMPONENT {
	INSIGHT_AND_ACTIVITY = 'INSIGHT_AND_ACTIVITY',
	PRICE_TARGET = 'PRICE_TARGET',
	QUARTERLY_REVENUE = 'QUARTERLY_REVENUE',
	VALUATIONS_AND_ESTIMATES = 'VALUATIONS_AND_ESTIMATES',
	YEARLY_REVENUE = 'YEARLY_REVENUE',
	PEER_ANALYSIS = 'PEER_ANALYSIS',
	INSIDER_TRADING = 'INSIDER_TRADING',
	EPS = 'EPS',
	STOCK_PEERS_BULK = 'STOCK_PEERS_BULK',
	DIVIDENDS = 'DIVIDENDS',
	BALANCE_SHEET = 'BALANCE_SHEET',
	INCOME_STATEMENT = 'INCOME_STATEMENT',
	PRICE_PERFORMANCE = 'PRICE_PERFORMANCE',
	PRICE_EARNINGS = 'PRICE_EARNINGS',
	TRADING_VOLUME = 'TRADING_VOLUME',
	ANNUAL_RETURNS = 'ANNUAL_RETURNS',
	TECHNICALS = 'TECHNICALS',
	HOLDINGS = 'HOLDINGS',
	TRANSACTIONS = 'TRANSACTIONS',
	ANNUAL_MARGIN_TRENDS = 'ANNUAL_MARGIN_TRENDS',
}

// Create mapping from enum to actual components
export const CHART_COMPONENT_MAP = {
	[CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY]: ChartSectionInsightAndActivity,
	[CHART_SECTION_COMPONENT.PRICE_TARGET]: ChartSectionPriceTarget,
	[CHART_SECTION_COMPONENT.QUARTERLY_REVENUE]: ChartSectionQuarterlyRevenue,
	[CHART_SECTION_COMPONENT.VALUATIONS_AND_ESTIMATES]: ChartSectionValuationsAndEstimates,
	[CHART_SECTION_COMPONENT.YEARLY_REVENUE]: ChartSectionYearlyRevenue,
	[CHART_SECTION_COMPONENT.PEER_ANALYSIS]: ChartSectionPeerAnalysis,
	[CHART_SECTION_COMPONENT.INSIDER_TRADING]: ChartSectionInsiderTrading,
	[CHART_SECTION_COMPONENT.EPS]: ChartSectionEps,
	[CHART_SECTION_COMPONENT.STOCK_PEERS_BULK]: ChartSectionStockPeersBulk,
	[CHART_SECTION_COMPONENT.DIVIDENDS]: ChartSectionDividends,
	[CHART_SECTION_COMPONENT.BALANCE_SHEET]: ChartSectionBalanceSheet,
	[CHART_SECTION_COMPONENT.INCOME_STATEMENT]: ChartSectionIncomeStatement,
	[CHART_SECTION_COMPONENT.PRICE_PERFORMANCE]: ChartSectionPricePerformance,
	[CHART_SECTION_COMPONENT.PRICE_EARNINGS]: ChartSectionPriceEarnings,
	[CHART_SECTION_COMPONENT.TRADING_VOLUME]: ChartSectionTradingVolume,
	[CHART_SECTION_COMPONENT.ANNUAL_RETURNS]: ChartSectionAnnualReturns,
	[CHART_SECTION_COMPONENT.TECHNICALS]: ChartSectionTechnicals,
	[CHART_SECTION_COMPONENT.HOLDINGS]: SectionHoldings,
	[CHART_SECTION_COMPONENT.TRANSACTIONS]: SectionTransactions,
	[CHART_SECTION_COMPONENT.ANNUAL_MARGIN_TRENDS]: ChartSectionAnnualMarginTrends,
} as const;

export type ChartComponentType = typeof CHART_COMPONENT_MAP[keyof typeof CHART_COMPONENT_MAP];

export interface IWidgetItem {
	id: string;
	title: string;
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
			],
		},
		{
			id: 'price-earnings',
			title: 'Price Earnings',
			component: CHART_SECTION_COMPONENT.PRICE_EARNINGS,
			items: [
				{
					id: 'price-earnings-1',
					title: 'P/E',
				},
				{
					id: 'price-earnings-2',
					title: 'P/E',
				},
			],
		},
		{
			id: 'trading-volume',
			title: 'Trading Volume',
			component: CHART_SECTION_COMPONENT.TRADING_VOLUME,
			items: [
				{
					id: 'trading-volume-1',
					title: 'Trading Volume',
				},
				{
					id: 'trading-volume-2',
					title: 'Trading Volume',
				},
			],
		},
		{
			id: 'annual-returns',
			title: 'Annual Returns',
			component: CHART_SECTION_COMPONENT.ANNUAL_RETURNS,
			items: [
				{
					id: 'annual-returns-1',
					title: 'Annual Returns',
				},
				{
					id: 'annual-returns-2',
					title: 'Annual Returns',
				},
			],
		},
		{
			id: 'price-target',
			title: 'Price Target',
			component: CHART_SECTION_COMPONENT.PRICE_TARGET,
			items: [
				{
					id: 'price-target-history',
					title: 'Price Target History',
				},
				{
					id: 'price-target-analysis',
					title: 'Price Target Analysis',
				},
			],
		},
		{
			id: 'yearly-revenue',
			title: 'Yearly revenue',
			component: CHART_SECTION_COMPONENT.YEARLY_REVENUE,
		},
		{
			id: 'chart-peers-bulks',
			title: 'Peer Analysis',
			component: CHART_SECTION_COMPONENT.STOCK_PEERS_BULK,
		},
		{
			id: 'quarterly-revenue',
			title: 'Quarterly revenue',
			component: CHART_SECTION_COMPONENT.QUARTERLY_REVENUE,
		},
		{
			id: 'peer-analysis',
			title: 'Peer analysis',
			component: CHART_SECTION_COMPONENT.PEER_ANALYSIS,
		},
		{
			id: 'insider-trading',
			title: 'Insider trading',
			component: CHART_SECTION_COMPONENT.INSIDER_TRADING,
		},
		{
			id: 'dividends',
			title: 'Dividends',
			component: CHART_SECTION_COMPONENT.DIVIDENDS,
		},
		{
			id: 'balance-sheet',
			title: 'Balance Sheet',
			component: CHART_SECTION_COMPONENT.BALANCE_SHEET,
		},
		{
			id: 'income-statement',
			title: 'Income Statement',
			component: CHART_SECTION_COMPONENT.INCOME_STATEMENT,
		},
		{
			id: 'eps',
			title: 'Earnings per Share',
			component: CHART_SECTION_COMPONENT.EPS,
		},
		{
			id: 'annual-margin-trends',
			title: 'Annual Margin Trends',
			component: CHART_SECTION_COMPONENT.ANNUAL_MARGIN_TRENDS,
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
			title: 'CAN BE REMOVED',
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
				},
				{
					id: 'moving-averages',
					title: 'Moving Averages',
				},
			],
		},
		{
			id: 'valuation-and-estimates',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.VALUATIONS_AND_ESTIMATES,
			items: [
				{
					id: 'valuation-metrics',
					title: 'CAN BE REMOVED',
				},
				{
					id: 'capital-structure',
					title: 'CAN BE REMOVED',
				},
			],
		},
		{
			id: 'price-target',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.PRICE_TARGET,
			items: [
				{
					id: 'price-target-history',
					title: 'CAN BE REMOVED',
				},
				{
					id: 'price-target-analysis',
					title: 'CAN BE REMOVED',
				},
			],
		},
		{
			id: 'yearly-revenue',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.YEARLY_REVENUE,
		},
		{
			id: 'chart-peers-bulks',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.STOCK_PEERS_BULK,
		},
		{
			id: 'quarterly-revenue',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.QUARTERLY_REVENUE,
		},
		{
			id: 'peer-analysis',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.PEER_ANALYSIS,
		},
		{
			id: 'insider-trading',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.INSIDER_TRADING,
		},
		{
			id: 'dividends',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.DIVIDENDS,
		},
		{
			id: 'balance-sheet',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.BALANCE_SHEET,
		},
		{
			id: 'income-statement',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.INCOME_STATEMENT,
		},
		{
			id: 'eps',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.EPS,
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
		{
			id: 'annual-margin-trends',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.ANNUAL_MARGIN_TRENDS,
		},
	],
	right: [
		{
			id: 'insight-and-activity',
			title: 'CAN BE REMOVED',
			component: CHART_SECTION_COMPONENT.INSIGHT_AND_ACTIVITY,
		},
	],
} as const;
