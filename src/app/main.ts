import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { router } from './router';
import { queryClient } from '@/shared/service/query-client';
import { validateConfig } from '@/shared/lib';
import { dashboardStateUtility } from '@/shared/lib/dashboard-state-utility';

import '@/assets/styles/base.css';

import 'virtual:svg-icons-register';


import App from './app.vue';

validateConfig();


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true });

// Register dashboard state utilities on window object for development/debugging
if (typeof window !== 'undefined') {
	Object.assign(window, {
		getDashboardState: dashboardStateUtility.getDashboardState,
		getAllDashboards: dashboardStateUtility.getAllDashboards,
		getGridInfo: dashboardStateUtility.getGridInfo,
		debugDashboardState: dashboardStateUtility.debugDashboardState,
	});
}

app.mount('#app');
