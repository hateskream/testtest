import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

import { router } from './router';
import { queryClient } from '@/shared/service/query-client';
import { validateConfig } from '@/shared/lib';

import '@/assets/styles/base.css';

import 'virtual:svg-icons-register';


import App from './app.vue';

validateConfig();

Chart.register(annotationPlugin);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true });


app.mount('#app');
