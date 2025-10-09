import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VCalendar from 'v-calendar';

import { router } from './router';
import { queryClient } from '@/shared/service/query-client';
import { validateConfig } from '@/shared/lib';

import '@/assets/styles/base.css';
import 'v-calendar/style.css';

import 'virtual:svg-icons-register';


import App from './app.vue';

validateConfig();


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true });
app.use(VCalendar);

app.mount('#app');
