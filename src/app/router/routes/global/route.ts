import { RouteNames, RoutePaths } from '@/types/route.d';

export const globalRoutes =
	[
		{
			path: RoutePaths.Home,
			name: RouteNames.Home,
			component: () => import('@/pages/home-page.vue'),
		},
		{
			path: RoutePaths.ChartStock,
			name: RouteNames.ChartStock,
			component: () => import('@/pages/chart-stock-page.vue'),
		},
		{
			path: RoutePaths.ChartCrypto,
			name: RouteNames.ChartCrypto,
			component: () => import('@/pages/chart-crypto-page.vue'),
		},

		{
			path: RoutePaths.Test,
			name: RouteNames.Test,
			component: () => import('@/pages/test-page.vue'),
		},
	];


export const testRoutes = [
	{
		path: RoutePaths.Automobile,
		name: RouteNames.Automobile,
		component: () => import('@/pages/automobiles-page.vue'),
	},
];
