import { type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router';

import { type ITickerRouteParams, RouteNames, RoutePaths, RouteTickerType } from '@/types/route.d';

const createTickerProps = (type: RouteTickerType) => {
	return (route: RouteLocationNormalized): ITickerRouteParams => ({
		id: parseInt(route.params.id as string, 10),
		type,
	});
};

export const globalRoutes: RouteRecordRaw[] = [
	{
		path: RoutePaths.Home,
		name: RouteNames.Home,
		component: () => import('@/pages/home-page.vue'),
	},
	{
		path: RoutePaths.Ticker,
		name: RouteNames.Ticker,
		redirect: { name: RouteNames.TickerStock, params: { id: '1' } },
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
	},
	{
		path: RoutePaths.News,
		name: RouteNames.News,
		component: () => import('@/pages/news-page.vue'),
	},
];

export const testRoutes: RouteRecordRaw[] = [
	{
		path: RoutePaths.Test,
		name: RouteNames.Test,
		component: () => import('@/pages/new-layout.vue'),
	},
	{
		path: RoutePaths.Heatmap,
		name: RouteNames.Heatmap,
		component: () => import('@/pages/heatmap-page.vue'),
	},
];
