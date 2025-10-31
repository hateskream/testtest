import type { Filters, IFilterConfig, IFilterState } from '../../base';
import {
	crosses,
	equal,
	equalOrGreater,
	equalOrLess,
	FilterOperator,
	greater,
	inDateRange,
	inRange,
	less,
	plainOptions,
	withDescription,
} from '../../base';
import { FilterFieldType } from '../../base/model/filter';

export enum StockFilters {
	Type = 'type',
	Watchlist = 'watchlist',
	Index = 'index',
	Price = 'price',
	ChangePercents = 'changePercents',
	MarketCap = 'marketCap',
	PriceEarnings = 'priceEarnings',
	EpsDilGrowth = 'epsDilGrowth',
	DividendYieldPercents = 'dividendYieldPercents',
	Industries = 'industries',
	Sectors = 'sectors',
	AnalystRatings = 'analystRatings',
	PerfPercents = 'perfPercents',
	RevenueGrowth = 'revenueGrowth',
	PEG = 'peg',
	ROE = 'roe',
	Beta = 'beta',
	RecentEarningsDate = 'recentEarningsDate',
	UpcomingEarningsDate = 'upcomingEarningsDate',
	Exchange = 'exchange',
}

const TYPE_FILTER_DEFAULT_PRESET = equal('all', 'All');

const TYPE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.RadioGroup,
		label: 'Type',
	},
	presets: [
		TYPE_FILTER_DEFAULT_PRESET,
		equal('gainers', 'Gainers'),
		equal('losers', 'Losers'),
		equal('top', 'Top'),
	],
	required: true,
};

const TYPE_FILTER_STATE: IFilterState = {
	selected: TYPE_FILTER_DEFAULT_PRESET.condition,
	presetId: TYPE_FILTER_DEFAULT_PRESET.id,
};

const MARKET_CAP_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'Market Cap',
		description: 'Market capitalization',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Giants among giants', equalOrGreater(200_000_000_000, '200B')),
		withDescription('The big players', inRange([10_000_000_000, 200_000_000_000], ['10B', '200B'])),
		withDescription('Major to massive', equalOrGreater(10_000_000_000, '10B')),
		withDescription('Enhanced mid-cap', equalOrGreater(2_000_000_000, '2B')),
		withDescription('Hidden gems', inRange([300_000_000, 2_000_000_000], ['300M', '2B'])),
		withDescription('Graduation candidates', equalOrGreater(300_000_000, '300M')),
		withDescription('Tiny market players', equalOrLess(50_000_000, '50M')),
	],
};

const PRICE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'Price',
		operators: [
			FilterOperator.EqualOrGreater,
			FilterOperator.EqualOrLess,
			FilterOperator.InRange,
			FilterOperator.Crosses,
			FilterOperator.Less,
			FilterOperator.Greater,
		],
	},
	presets: [
		withDescription('Partial share trading windows', equalOrGreater(100)),
		withDescription('Min-market', inRange([10, 100])),
		withDescription('Budget tier', equalOrLess(10)),
		withDescription('Low-price speculative stocks', equalOrLess(5)),
		withDescription('Uptrend', greater('EMA50', 'EMA (50)')),
		withDescription('Downtrend', less('EMA50', 'EMA (50)')),
		withDescription('Overbought', crosses('BB.upper', 'BB (20), Upper')),
		withDescription('Oversold', crosses('BB.lower', 'BB (20), Lower')),
	],
};

const PRICE_CHANGE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'Change %',
		description: 'Price change %',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Skyrocketing', equalOrGreater(30, '30%')),
		withDescription('Seize your market returns', equalOrGreater(20, '20%')),
		withDescription('Follow the price trail', equalOrGreater(10, '10%')),
		withDescription('Consistent small gains', equalOrGreater(5, '5%')),
		withDescription('Noise, not signal', inRange([0, 5], ['0%', '5%'])),
		withDescription('The good size of zero', equalOrGreater(0, '0%')),
		withDescription('Below the line', equalOrLess(0, '0%')),
		withDescription('Sub-zero territory', inRange([-5, 0], ['-5%', '0%'])),
		withDescription('Minus zone activated', equalOrLess(-5, '-5%')),
		withDescription('Down and still dropping', equalOrLess(-10, '-10%')),
		withDescription('Rescue mission territory', equalOrLess(-20, '-20%')),
		withDescription('Critically damaged', equalOrLess(-30, '-30%')),
	],
};

const PRICE_EARNINGS_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'P/E',
		description: 'Price to earnings ration',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Expensive but dominant', equalOrGreater(50)),
		withDescription('Expansion stage', inRange([25, 50])),
		withDescription('Market-aligned', inRange([15, 25])),
		withDescription('No-frills pricing', equalOrLess(25)),
		withDescription('Deep value territory', equalOrLess(15)),
		withDescription('Proven money-makers', equalOrGreater(0)),
	],
};

const EPS_DIL_GROWTH_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'EPS dil growth',
		description: 'EPS diluted growth %',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Blast-off level growth', equalOrGreater(50, '50%')),
		withDescription('Consistent upward path', equalOrGreater(25, '25%')),
		withDescription('Steady state', equalOrLess(10, '10%')),
		withDescription('Keeping the lights on', equalOrGreater(0, '0%')),
		withDescription('In decline', equalOrLess(0, '0%')),
		withDescription('Credibility destroyed', equalOrLess(-25, '-25%')),
	],
};

const DIVIDEND_YIELD_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'Div yield %',
		description: 'Dividend yield %',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Passive income paradise', equalOrGreater(10, '10%')),
		withDescription('Pretty high', equalOrGreater(5, '5%')),
		withDescription('Ain\'t bad', equalOrGreater(2, '2%')),
		withDescription('Not much to write home about', inRange([0, 2], ['0%', '2%'])),
	],
};

const INDUSTRIES_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.CheckboxGroup,
		label: 'Industries',
		options: plainOptions([
			'Media & Entertainment',
			'Communication equipment',
			'Technology distributors',
			'Consumer electronics',
			'Renewable utilities',
			'Regulated water',
			'Regulated gas',
			'Regulated electric',
			'Independent power producers',
			'Diversified utilities',
			'General utilities',
		]),
		searchable: true,
		searchPlaceholder: 'Search industries',
	},
};

const SECTORS_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.CheckboxGroup,
		label: 'Sectors',
		options: plainOptions([
			'Commercial services',
			'Communications',
			'Consumer durables',
			'Consumer non-durables',
			'Consumer services',
			'Electronic technology',
			'Energy Minerals',
			'Finance',
			'Government',
			'Health services',
			'Health technology',
			'Industrial services',
			'Miscellaneous',
			'Non-energy minerals',
			'Process industries',
			'Producer manufacturing',
			'Retail trade',
			'Technology services',
			'Transportation',
			'Utilities',
		]),
		searchable: true,
		searchPlaceholder: 'Search sectors',
	},
};

const ANALYST_RATING_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.CheckboxGroup,
		label: 'Analyst Ratings',
		options: plainOptions(['Strong cell', 'Sell', 'Neutral', 'Buy', 'String buy']),
	},
};

const PERFORMANCE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'Performance %',
		description: 'EPS diluted growth %',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Skyrocketing', equalOrGreater(30, '30%')),
		withDescription('Seize your market returns', equalOrGreater(20, '20%')),
		withDescription('Follow the price trail', equalOrGreater(10, '10%')),
		withDescription('Consistent small gains', equalOrGreater(5, '5%')),
		withDescription('Noise, not signal', inRange([0, 5], ['0%', '5%'])),
		withDescription('The good size of zero', equalOrGreater(0, '0%')),
		withDescription('Below the line', equalOrLess(0, '0%')),
		withDescription('Sub-zero territory', inRange([-5, 0], ['-5%', '0%'])),
		withDescription('Minus zone activated', equalOrLess(-5, '-5%')),
		withDescription('Down and still dropping', equalOrLess(-10, '-10%')),
		withDescription('Rescue mission territory', equalOrLess(-20, '-20%')),
		withDescription('Critically damaged', equalOrLess(-30, '-30%')),
	],
};

const REVENUE_GROWTH_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'Revenue growth',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Pack your spacesuit', equalOrGreater(50, '50%')),
		withDescription('Up we go', equalOrGreater(25, '25%')),
		withDescription('Hello plateau', equalOrLess(10, '10%')),
		withDescription('It\'s something', equalOrGreater(0, '0%')),
		withDescription('Looks bleak', equalOrLess(0, '0%')),
		withDescription('Somebody\'s fired', equalOrLess(-25, '-25%')),
	],
};

const PEG_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'PEG',
		description: 'Price to earning to growth',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Huffing hopium?', equalOrGreater(2)),
		withDescription('Great expectations', equalOrLess(2)),
		withDescription('Potentially overvalued', equalOrGreater(1)),
		withDescription('Potentially undervalued', equalOrLess(1)),
		withDescription('Fair value-ish', inRange([0.9, 1])),
		withDescription('Undervalued chameleons', equalOrLess(0.5)),
	],
};

const ROE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'ROE',
		description: 'Return on equity %',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		withDescription('Crème de la crème', equalOrGreater(30, '30%')),
		withDescription('High returns', equalOrGreater(15, '15%')),
		withDescription('Profitable', equalOrGreater(0, '0%')),
		withDescription('Unprofitable', equalOrLess(0, '0%')),
		withDescription('Losses, losses, everywhere', equalOrLess(-15, '-15%')),
	],
};

const BETA_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.Condition,
		label: 'ROE',
		operators: [FilterOperator.EqualOrGreater, FilterOperator.EqualOrLess, FilterOperator.InRange],
	},
	presets: [
		inRange([0, 0.5]),
		inRange([0.5, 1]),
		inRange([0.9, 1.1]),
		equalOrGreater(1),
		inRange([1, 1.5]),
		equalOrGreater(2),
		equalOrLess(0),
		equalOrGreater(0),
	],
};

const RECENT_EARNINGS_DATE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.RadioGroup,
		label: 'Recent earnings date',
	},
	presets: [
		inDateRange(FilterOperator.InDayRange, [0, 0], 'Current trading day'),
		inDateRange(FilterOperator.InDayRange, [-1, -1], 'Previous day'),
		inDateRange(FilterOperator.InDayRange, [-5, -1], 'Previous 5 days'),
		inDateRange(FilterOperator.InWeekRange, [0, 0], 'This week'),
		inDateRange(FilterOperator.InWeekRange, [-1, -1], 'Previous week'),
		inDateRange(FilterOperator.InMonthRange, [-1, -1], 'This month'),
	],
};

const UPCOMING_EARNINGS_DATE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.RadioGroup,
		label: 'Upcoming earnings date',
	},
	presets: [
		inDateRange(FilterOperator.InDayRange, [0, 0], 'Current trading day'),
		inDateRange(FilterOperator.InDayRange, [1, 1], 'Next day'),
		inDateRange(FilterOperator.InDayRange, [1, 5], 'Next 5 days'),
		inDateRange(FilterOperator.InWeekRange, [0, 0], 'This week'),
		inDateRange(FilterOperator.InWeekRange, [1, 1], 'Next week'),
		inDateRange(FilterOperator.InMonthRange, [1, 1], 'Next month'),
	],
};

const EXCHANGE_FILTER_DEFAULT_PRESET = withDescription('Nasdaq Stock Market', equal('nasdaq', 'NASDAQ'));

const EXCHANGE_FILTER: IFilterConfig = {
	field: {
		type: FilterFieldType.RadioGroup,
		label: 'Exchange',
	},
	presets: [
		EXCHANGE_FILTER_DEFAULT_PRESET,
		withDescription('New York Stock Exchange', equal('nyse', 'NYSE')),
		withDescription('London Stock Exchange', equal('lse', 'LSE')),
		withDescription('Tokyo Stock Exchange', equal('tse', 'TSE')),
		withDescription('Hong Kong Stock Exchange', equal('hkex', 'HKEX')),
		withDescription('Shanghai Stock Exchange', equal('sse', 'SSE')),
	],
	required: true,
};

const EXCHANGE_FILTER_STATE: IFilterState = {
	selected: EXCHANGE_FILTER_DEFAULT_PRESET.condition,
	presetId: EXCHANGE_FILTER_DEFAULT_PRESET.id,
};

function createNullState() {
	return {
		selected: null,
	};
}

export const STOCK_FILTERS: Filters = {
	[StockFilters.Type]: {
		config: TYPE_FILTER,
		state: TYPE_FILTER_STATE,
	},
	[StockFilters.Price]: {
		config: PRICE_FILTER,
		state: createNullState(),
	},
	[StockFilters.ChangePercents]: {
		config: PRICE_CHANGE_FILTER,
		state: createNullState(),
	},
	[StockFilters.MarketCap]: {
		config: MARKET_CAP_FILTER,
		state: createNullState(),
	},
	[StockFilters.PriceEarnings]: {
		config:  PRICE_EARNINGS_FILTER,
		state: createNullState(),
	},
	[StockFilters.EpsDilGrowth]: {
		config: EPS_DIL_GROWTH_FILTER,
		state: createNullState(),
	},
	[StockFilters.DividendYieldPercents]: {
		config: DIVIDEND_YIELD_FILTER,
		state: createNullState(),
	},
	[StockFilters.Industries]: {
		config: INDUSTRIES_FILTER,
		state: createNullState(),
	},
	[StockFilters.Sectors]: {
		config: SECTORS_FILTER,
		state: createNullState(),
	},
	[StockFilters.AnalystRatings]: {
		config: ANALYST_RATING_FILTER,
		state: createNullState(),
	},
	[StockFilters.PerfPercents]: {
		config: PERFORMANCE_FILTER,
		state: createNullState(),
	},
	[StockFilters.RevenueGrowth]: {
		config: REVENUE_GROWTH_FILTER,
		state: createNullState(),
	},
	[StockFilters.PEG]: {
		config: PEG_FILTER,
		state: createNullState(),
	},
	[StockFilters.ROE]: {
		config: ROE_FILTER,
		state: createNullState(),
	},
	[StockFilters.Beta]: {
		config: BETA_FILTER,
		state: createNullState(),
	},
	[StockFilters.RecentEarningsDate]: {
		config: RECENT_EARNINGS_DATE_FILTER,
		state: createNullState(),
	},
	[StockFilters.UpcomingEarningsDate]: {
		config: UPCOMING_EARNINGS_DATE_FILTER,
		state: createNullState(),
	},
	[StockFilters.Exchange]: {
		config: EXCHANGE_FILTER,
		state: EXCHANGE_FILTER_STATE,
	},
};
