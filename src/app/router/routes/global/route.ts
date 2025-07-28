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
	];


export const testRoutes = [
	{
		path: RoutePaths.Automobile,
		name: RouteNames.Automobile,
		component: () => import('@/pages/automobiles-page.vue'),
	},
	{
		path: RoutePaths.Heatmap,
		name: RouteNames.Heatmap,
		component: () => import('@/pages/heatmap-page.vue'),
	},
];
