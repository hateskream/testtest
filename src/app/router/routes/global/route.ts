import { type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router';

import {
	type IScreenerRouteParams,
	type ITickerRouteParams,
	RouteNames,
	RoutePaths,
	RouteScreenerType,
	RouteTickerType,
} from '@/types/route.d';

const createTickerProps = (type: RouteTickerType) => {
	return (route: RouteLocationNormalized): ITickerRouteParams => ({
		id: parseInt(route.params.id as string, 10),
		type,
	});
};

const createScreenerProps = (type: RouteScreenerType) => {
	return (): IScreenerRouteParams => ({
		type,
	});
};

export const globalRoutes: RouteRecordRaw[] = [
	{
		path: RoutePaths.Home,
		name: RouteNames.Home,
		component: () => import('@/pages/home-page.vue'),
		meta: {
			title: 'i88 — Track and analyze markets',
			description: 'Where the world charts, chats, and trades markets. Free to sign up.',
		},
	},
	{
		path: RoutePaths.Ticker,
		name: RouteNames.Ticker,
		redirect: { name: RouteNames.TickerStock, params: { id: '1' } },
		meta: {
			title: 'i88 — Ticker Page',
			description: 'Watch live ticker to Dollar chart, follow prices in real-time and get price history. ' +
				'Check technical analysis and forecasts.',
		},
		children: [
			{
				path: RoutePaths.TickerCryptoWithId,
				name: RouteNames.TickerCrypto,
				component: () => import('@/pages/ticker-page.vue'),
				props: createTickerProps(RouteTickerType.CRYPTO),
			},
			{
				path: RoutePaths.TickerStockWithId,
				name: RouteNames.TickerStock,
				component: () => import('@/pages/ticker-page.vue'),
				props: createTickerProps(RouteTickerType.STOCK),
			},
			{
				path: RoutePaths.TickerForexWithId,
				name: RouteNames.TickerForex,
				component: () => import('@/pages/ticker-page.vue'),
				props: createTickerProps(RouteTickerType.FOREX),
			},
			{
				path: RoutePaths.TickerCommoditiesWithId,
				name: RouteNames.TickerCommodities,
				component: () => import('@/pages/ticker-page.vue'),
				props: createTickerProps(RouteTickerType.COMMODITIES),
			},
			{
				path: RoutePaths.TickerIndicesWithId,
				name: RouteNames.TickerIndices,
				component: () => import('@/pages/ticker-page.vue'),
				props: createTickerProps(RouteTickerType.INDICES),
			},
			{
				path: RoutePaths.TickerETFWithId,
				name: RouteNames.TickerETF,
				component: () => import('@/pages/ticker-page.vue'),
				props: createTickerProps(RouteTickerType.ETF),
			},
			{
				path: RoutePaths.TickerIndices,
				redirect: { name: RouteNames.TickerIndices, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerETF,
				redirect: { name: RouteNames.TickerETF, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerCommodities,
				redirect: { name: RouteNames.TickerCommodities, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerCrypto,
				redirect: { name: RouteNames.TickerCrypto, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerStock,
				redirect: { name: RouteNames.TickerStock, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerForex,
				redirect: { name: RouteNames.TickerForex, params: { id: '1' } },
			},
			{
				path: ':pathMatch(.*)*',
				redirect: { name: RouteNames.TickerStock, params: { id: '1' } },
			},
		],
	},
	{
		path: RoutePaths.Calendar,
		name: RouteNames.Calendar,
		component: () => import('@/pages/calendar-page.vue'),
		meta: {
			title: 'Calendar — World Economic Events — i88',
			description: 'Calendar covers key economic events, announcements and news that affect the market.',
		},
	},
	{
		path: RoutePaths.News,
		name: RouteNames.News,
		component: () => import('@/pages/news-page.vue'),
		children: [
			{
				name: RouteNames.NewsDetails,
				path: RoutePaths.NewsDetails,
				component: () => import('@/pages/news-page.vue'),
			},
		],
		meta: {
			title: 'News — i88',
			description: 'Scan world news in one place with our News flow. Select a market, ' +
				'set a country, and choose the updates: press releases, market estimates, and more.',
		},
	},
	{
		path: RoutePaths.Screener,
		name: RouteNames.Screener,
		redirect: { name: RouteNames.ScreenerStock },
		children: [
			{
				path: RoutePaths.ScreenerStock,
				name: RouteNames.ScreenerStock,
				component: () => import('@/pages/screener-page.vue'),
				props: createScreenerProps(RouteScreenerType.STOCK),
				meta: {
					title: 'Stock Screener: Search and Filter Stocks — i88',
					description: 'Use the Stock Screener to scan and filter instruments based on market cap, ' +
						'dividend yield, volume to find top gainers, most volatile stocks and their all-time highs.',
				},
			},
			{
				path: RoutePaths.ScreenerCrypto,
				name: RouteNames.ScreenerCrypto,
				component: () => import('@/pages/screener-page.vue'),
				props: createScreenerProps(RouteScreenerType.CRYPTO),
				meta: {
					title: 'Crypto Screener: All Existing Crypto Coins — i88',
					description: 'Our screener lets you easily scan numerous crypto coins — watch their performance, ' +
						'or sort them by market cap or volume to discover trading opportunities.',
				},
			},
			{
				path: RoutePaths.ScreenerBond,
				name: RouteNames.ScreenerBond,
				component: () => import('@/pages/screener-page.vue'),
				props: createScreenerProps(RouteScreenerType.BOND),
				meta: {
					title: 'Bond Screener: Explore Fixed Income Opportunities — i88',
					description: 'Browse world\'s government and corporate bonds from the convenience of our ' +
						'Bond Screener. Scan prices, maturity date, and more to find reliable bonds.',
				},
			},
			{
				path: RoutePaths.ScreenerEtf,
				name: RouteNames.ScreenerEtf,
				component: () => import('@/pages/screener-page.vue'),
				props: createScreenerProps(RouteScreenerType.ETF),
				meta: {
					title: 'ETF Screener: Browse Exchange-Traded Funds — i88',
					description: 'Use our ETF screener to filter exchange-traded funds by country, ' +
						'net asset value, and other key stats to spot those with the best performance and return.',
				},
			},
			{
				path: RoutePaths.ScreenerCex,
				name: RouteNames.ScreenerCex,
				component: () => import('@/pages/screener-page.vue'),
				props: createScreenerProps(RouteScreenerType.CEX),
				meta: {
					title: 'CEX Screener: Centralized Exchanges Pairs — i88',
					description: 'Browse crypto pairs traded on centralized exchanges: BTCUSD, ETHUSD, etc. ' +
						'Analyze price dynamics, check transaction data to make informed decisions.',
				},
			},
			{
				path: RoutePaths.ScreenerDex,
				name: RouteNames.ScreenerDex,
				component: () => import('@/pages/screener-page.vue'),
				props: createScreenerProps(RouteScreenerType.DEX),
				meta: {
					title: 'DEX Screener: Scan Decentralized Finance — i88',
					description: 'See crypto pairs traded on decentralized exchanges in our screener. ' +
						'Find those with the most transactions or unique buyers and check their performance.',
				},
			},
			{
				path: ':pathMatch(.*)*',
				redirect: { name: RouteNames.ScreenerStock },
			},
		],
		meta: {
			title: 'Screener: Search and Filter — i88',
		},
	},
	{
		path: RoutePaths.Tv,
		name: RouteNames.Tv,
		component: () => import('@/pages/tv-page.vue'),
		meta: {
			title: 'TV View — i88',
			description: 'Create your perfect market dashboard with selected widgets, ' +
				'important metrics, and data on one screen.',
		},
	},
	{
		path: RoutePaths.Heatmap,
		name: RouteNames.Heatmap,
		component: () => import('@/pages/heatmap-page.vue'),
		meta: {
			title: 'Heatmap — i88',
			description: 'A quick look at the market: The heat map shows leaders and laggards in real time, ' +
				'helping you find opportunities for solutions.',
		},
	},
];

export const testRoutes: RouteRecordRaw[] = [
	{
		path: RoutePaths.Test,
		name: RouteNames.Test,
		component: () => import('@/pages/home-page.vue'),
	},
];
