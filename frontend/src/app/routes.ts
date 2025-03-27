import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../pages/home').then(m => m.HomePage),
		},
		{
			path: '/price_demo',
			name: 'price_demo',
			component: () => import('../pages/price').then(m => m.PriceDemoPage),
		},
	],
});

export default router;
