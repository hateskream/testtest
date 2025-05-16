import { createRouter, createWebHistory } from 'vue-router';


export enum RouteNames {
	Home = 'home',
	Chart = 'chart',
}
export enum RoutePaths {
	Home = '/',
	Chart = '/chart',
}
const router = createRouter({
	history: createWebHistory(),
	routes: [
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
	],
});

export default router;
