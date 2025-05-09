import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('@/pages/home-page.vue'),
		},
	],
});

export default router;
