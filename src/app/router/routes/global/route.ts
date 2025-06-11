import { RouteNames, RoutePaths } from '@/types/route.d';

export const globalRoutes =
	[
		{
			path: RoutePaths.Home,
			name: RouteNames.Home,
			component: () => import('@/pages/home-page.vue'),
		},
		{
			path: RoutePaths.Chart,
			name: RouteNames.Chart,
			component: () => import('@/pages/chart-page.vue'),
		},
		{
			path: RoutePaths.Test,
			name: RouteNames.Test,
			component: () => import('@/pages/test-page.vue'),
		},
		{
			path: RoutePaths.Charts,
			name: RouteNames.Charts,
			component: () => import('@/pages/charts-page.vue'),
		},
	];
