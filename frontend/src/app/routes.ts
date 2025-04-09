import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			// component: () => import('../pages/home').then(m => m.HomePage),
			component: () => import('../pages/dashboard-grid').then(m => m.DashboardGridPage),
		},
		{
			path: '/price_demo',
			name: 'price_demo',
			component: () => import('../pages/price').then(m => m.PriceDemoPage),
		},
		{
			path: '/dashboard_grid',
			name: 'dashboard_grid',
			component: () => import('../pages/dashboard-grid').then(m => m.DashboardGridPage),
		},
	],
});

export default router;
