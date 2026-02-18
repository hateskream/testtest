import { type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router';

import {
	type IScreenerRouteParams,
	type ITickerRouteParams,
	RouteNames,
	RoutePaths,
	RouteScreenerType,
	RouteTickerType,
} from '@/types/route.d';
import { ErrorCode } from '@/modules/error/model';

import OfflinePage from '@/pages/offline-page.vue';

const createTickerProps = (type: RouteTickerType) => {
	return (route: RouteLocationNormalized): ITickerRouteParams => ({
		id: route.params.id as string,
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
			title: 'Track and analyze markets',
			titleTemplate: '%appName %separator %s',
			description: 'Where the world charts, chats, and trades markets. Free to sign up.',
		},
	},
	{
		path: RoutePaths.Ticker,
		name: RouteNames.Ticker,
		redirect: { name: RouteNames.TickerStock, params: { id: '1' } },
		meta: {
			title: 'Ticker Page',
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
			title: 'Calendar — World Economic Events',
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
			title: 'News',
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
					title: 'Stock Screener: Search and Filter Stocks',
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
					title: 'Crypto Screener: All Existing Crypto Coins',
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
					title: 'Bond Screener: Explore Fixed Income Opportunities',
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
					title: 'ETF Screener: Browse Exchange-Traded Funds',
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
					title: 'CEX Screener: Centralized Exchanges Pairs',
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
					title: 'DEX Screener: Scan Decentralized Finance',
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
			title: 'Screener: Search and Filter',
		},
	},
	{
		path: RoutePaths.Tv,
		name: RouteNames.Tv,
		component: () => import('@/pages/tv-page.vue'),
		meta: {
			title: 'TV View',
			description: 'Create your perfect market dashboard with selected widgets, ' +
				'important metrics, and data on one screen.',
		},
	},
	{
		path: RoutePaths.Heatmap,
		name: RouteNames.Heatmap,
		component: () => import('@/pages/heatmap-page.vue'),
		meta: {
			title: 'Heatmap',
			description: 'A quick look at the market: The heat map shows leaders and laggards in real time, ' +
				'helping you find opportunities for solutions.',
		},
	},
	{
		path: RoutePaths.Offline,
		name: RouteNames.Offline,
		component: OfflinePage,
		meta: {
			title: 'Network Error',
		},
	},
	{
		path: RoutePaths.Error,
		name: RouteNames.Error,
		component: () => import('@/pages/error-page.vue'),
		props: (route: RouteLocationNormalized) => {
			const { code = 404 } = route.params as { code: string | number | undefined };
			return {
				code,
			};
		},
		meta: {
			title: 'Error',
		},
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: {
			name: RouteNames.Error,
			params: {
				code: ErrorCode.NOT_FOUND,
			},
		},
	},
];

export const testRoutes: RouteRecordRaw[] = [
	{
		path: RoutePaths.Test,
		name: RouteNames.Test,
		component: () => import('@/pages/home-page.vue'),
	},
	{
		path: RoutePaths.TickerUnemploymentRateTest,
		name: RouteNames.TickerUnemploymentRateTest,
		component: () => import('@/pages/unemployment-rate-test-page.vue'),
	},
	{
		path: RoutePaths.TickerOld,
		name: RouteNames.TickerOld,
		redirect: { name: RouteNames.TickerStockOld, params: { id: '1' } },
		meta: {
			title: 'Ticker Page',
			description: 'Watch live ticker to Dollar chart, follow prices in real-time and get price history. ' +
				'Check technical analysis and forecasts.',
		},
		children: [
			{
				path: RoutePaths.TickerCryptoWithId,
				name: RouteNames.TickerCryptoOld,
				component: () => import('@/pages/old-ticker-page.vue'),
				props: createTickerProps(RouteTickerType.CRYPTO),
			},
			{
				path: RoutePaths.TickerStockWithId,
				name: RouteNames.TickerStockOld,
				component: () => import('@/pages/old-ticker-page.vue'),
				props: createTickerProps(RouteTickerType.STOCK),
			},
			{
				path: RoutePaths.TickerForexWithId,
				name: RouteNames.TickerForexOld,
				component: () => import('@/pages/old-ticker-page.vue'),
				props: createTickerProps(RouteTickerType.FOREX),
			},
			{
				path: RoutePaths.TickerCommoditiesWithId,
				name: RouteNames.TickerCommoditiesOld,
				component: () => import('@/pages/old-ticker-page.vue'),
				props: createTickerProps(RouteTickerType.COMMODITIES),
			},
			{
				path: RoutePaths.TickerIndicesWithId,
				name: RouteNames.TickerIndicesOld,
				component: () => import('@/pages/old-ticker-page.vue'),
				props: createTickerProps(RouteTickerType.INDICES),
			},
			{
				path: RoutePaths.TickerETFWithId,
				name: RouteNames.TickerETFOld,
				component: () => import('@/pages/old-ticker-page.vue'),
				props: createTickerProps(RouteTickerType.ETF),
			},
			{
				path: RoutePaths.TickerIndices,
				redirect: { name: RouteNames.TickerIndicesOld, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerETF,
				redirect: { name: RouteNames.TickerETFOld, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerCommodities,
				redirect: { name: RouteNames.TickerCommoditiesOld, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerCrypto,
				redirect: { name: RouteNames.TickerCryptoOld, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerStock,
				redirect: { name: RouteNames.TickerStockOld, params: { id: '1' } },
			},
			{
				path: RoutePaths.TickerForex,
				redirect: { name: RouteNames.TickerForexOld, params: { id: '1' } },
			},
			{
				path: ':pathMatch(.*)*',
				redirect: { name: RouteNames.TickerStockOld, params: { id: '1' } },
			},
		],
	},
	{
		path: RoutePaths.TickerPageFooter,
		name: RouteNames.TickerPageFooter,
		component: () => import('@/pages/ticker-page-footer-test.vue'),
	},
	{
		path: RoutePaths.TickerPageHeader,
		name: RouteNames.TickerPageHeader,
		component: () => import('@/pages/ticker-header-page-test.vue'),
	},
	{
		path: RoutePaths.LinksTestPage,
		name: RouteNames.LinksTestPage,
		component: () => import('@/pages/links-widget-page-test.vue'),
	},
	{
		path: RoutePaths.KeyIndicatorsTest,
		name: RouteNames.KeyIndicatorsTest,
		component: () => import('@/pages/key-indicators-test-page.vue'),
	},
	{
		path: RoutePaths.TickerWidget,
		name: RouteNames.TickerWidget,
		redirect: {
			name: RouteNames.TickerWidgetPreview,
			params: {
				widgetName: 'activity-metrics',
			},
		},
		children: [
			{
				path: RoutePaths.TickerWidgetPreview,
				name: RouteNames.TickerWidgetPreview,
				component: () => import('@/pages/ticker-widget-page.vue'),
				props: (route: RouteLocationNormalized) => ({
					widgetName: route.params.widgetName,
				}),
			},
		],
		meta: {
			title: 'Test Ticker Widgets',
		},
	},
];
