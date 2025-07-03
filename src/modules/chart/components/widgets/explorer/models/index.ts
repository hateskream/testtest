export interface IWidgetItem {
	id: string;
	title: string;
}

export interface ISectionItem {
	id: string;
	title: string;
	items?: IWidgetItem[];
}

export const chartWidgetTestSections: ISectionItem[] = [
	{
		id: 'financials',
		title: 'Financials',
		items: [
			{ id: 'income-statement', title: 'Income Statement' },
			{ id: 'balance-sheet', title: 'Balance Sheet' },
			{ id: 'cash-flow', title: 'Cash Flow' },
			{ id: 'key-ratios', title: 'Key Ratios' },
			{ id: 'debt-analysis', title: 'Debt Analysis' },
			{ id: 'working-capital', title: 'Working Capital' },
			{ id: 'return-on-equity', title: 'Return on Equity' },
		],
	},
	{
		id: 'earnings',
		title: 'Earnings',
		items: [
			{ id: 'eps-estimates', title: 'EPS Estimates' },
			{ id: 'revenue-forecasts', title: 'Revenue Forecasts' },
			{ id: 'earnings-calendar', title: 'Earnings Calendar' },
			{ id: 'historical-performance', title: 'Historical Performance' },
			{ id: 'earnings-surprises', title: 'Earnings Surprises' },
			{ id: 'growth-metrics', title: 'Growth Metrics' },
		],
	},

	{
		id: 'insider',
		title: 'Insider Trading',
		items: [
			{ id: 'recent-transactions', title: 'Recent Transactions' },
			{ id: 'executive-trades', title: 'Executive Trades' },
			{ id: 'institutional-holdings', title: 'Institutional Holdings' },
			{ id: 'form-4-filings', title: 'Form 4 Filings' },
			{ id: 'insider-ownership', title: 'Insider Ownership' },
			{ id: 'trading-patterns', title: 'Trading Patterns' },
			{ id: 'ownership-changes', title: 'Ownership Changes' },
		],
	},
	{
		id: 'dividends',
		title: 'Dividends & Yield',
		items: [
			{ id: 'dividend-history', title: 'Dividend History' },
			{ id: 'yield-analysis', title: 'Yield Analysis' },
			{ id: 'payout-ratio', title: 'Payout Ratio' },
			{ id: 'ex-dividend-dates', title: 'Ex-Dividend Dates' },
			{ id: 'dividend-growth-rate', title: 'Dividend Growth Rate' },
			{ id: 'yield-comparison', title: 'Yield Comparison' },
		],
	},
	{
		id: 'technical',
		title: 'Technical Analysis',
		items: [
			{ id: 'moving-averages', title: 'Moving Averages' },
			{ id: 'rsi-indicator', title: 'RSI Indicator' },
			{ id: 'macd-analysis', title: 'MACD Analysis' },
			{ id: 'support-resistance', title: 'Support & Resistance' },
			{ id: 'volume-analysis', title: 'Volume Analysis' },
			{ id: 'bollinger-bands', title: 'Bollinger Bands' },
		],
	},
	{
		id: 'market',
		title: 'Market Data',
		items: [
			{ id: 'real-time-price', title: 'Real-time Price' },
			{ id: 'trading-volume', title: 'Trading Volume' },
			{ id: 'market-cap', title: 'Market Cap' },
			{ id: 'beta-analysis', title: 'Beta Analysis' },
			{ id: '52-week-range', title: '52-Week Range' },
			{ id: 'volatility-metrics', title: 'Volatility Metrics' },
		],
	},
	{
		id: 'news',
		title: 'News & Events',
		items: [
			{ id: 'latest-news', title: 'Latest News' },
			{ id: 'press-releases', title: 'Press Releases' },
			{ id: 'sec-filings', title: 'SEC Filings' },
			{ id: 'earnings-calls', title: 'Earnings Calls' },
			{ id: 'conference-presentations', title: 'Conference Presentations' },
			{ id: 'analyst-reports', title: 'Analyst Reports' },
		],
	},
];

export const chartWidgetRealSections = [
	{
		id: 'valuation-and-estimates',
		title: 'Valuation and estimates',
		items: [
			{ id: 'valuation-metrics', title: 'Valuation Metrics' },
			{ id: 'capital-structure', title: 'Capital Structure' },
		],
	},
	{
		id:'price-target',
		title: 'Price Target',
		items: [
			{ id: 'price-target-history', title: 'Price Target History' },
			{ id: 'price-target-analysis', title: 'Price Target Analysis' },
		],
	},
	{
		id:'yearly-revenue',
		title: 'Yearly revenue',
	},
	{
		id:'chart-peers-bulks',
		title: 'Peer Analysis',
	},
	{
		id:'quarterly-revenue',
		title: 'Quarterly revenue',
	},
	{
		id:'peer-analysis',
		title: 'Peer analysis',
	},
	{
		id:'insider-trading',
		title: 'Insider trading',
	},
	{
		id:'dividends',
		title: 'Dividends',
	},
	{
		id:'balance-sheet',
		title: 'Balance Sheet',
	},
];
