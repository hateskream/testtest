import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VCalendar from 'v-calendar';
import { registerComponent } from '@shared/component-library';
import { createHead } from '@unhead/vue/client';

import { router } from './router';
import { validateConfig } from '@/shared/lib';
// eslint-disable-next-line import/order
import { queryClient } from '@/shared/service/query-client';

import '@/assets/styles/base.css';
import 'v-calendar/style.css';

import 'virtual:svg-icons-register';


import { useStorageVersion } from '@/shared/composables';

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
app.use(VCalendar);

const head = createHead();
app.use(head);

app.mount('#app');
