import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { registerComponent } from '@shared/component-library';

import '@/assets/styles/base.css';
import 'virtual:svg-icons-register';
import '@fontsource-variable/roboto-flex/full.css';

import { validateConfig } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { registerVCalendar } from '@/shared/ui/date-picker/setup';
import { registerLogger } from '@/shared/service/monitoring';
import { useStorageVersion } from '@/shared/composables';
import { router } from './router';
import { createAppHead } from './head';

import '@fontsource-variable/roboto-flex/full.css';
import '@/assets/styles/base.css';

import 'virtual:svg-icons-register';

import App from './app.vue';

validateConfig();

const { compareVersions, updateVersion } = useStorageVersion();

if (!compareVersions()) {
	localStorage.clear();
	updateVersion();
}

registerComponent('i88-chart');

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true });
app.use(createAppHead({ appName: 'i88' }));

registerVCalendar(app);

// Test gitlab env
// oxlint-disable-next-line no-console
console.log('Sentry DSN', import.meta.env['VITE_SENTRY_DSN']);

registerLogger({ app, router });

app.mount('#app');
