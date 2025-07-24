import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import '@/assets/styles/base.css';

import 'virtual:svg-icons-register';

import { router } from './router';
import { queryClient } from '@/shared/service/query-client';
import { validateConfig } from '@/shared/lib';

import App from './app.vue';

validateConfig();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true });

app.mount('#app');
