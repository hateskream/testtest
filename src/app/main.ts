import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { registerComponent } from '@shared/component-library';

import { router } from './router';
import { createAppHead } from './head';
import { queryClient } from '@/shared/service/query-client';
import { validateConfig } from '@/shared/lib';
import { registerVCalendar } from '@/shared/ui/date-picker/setup';

import '@fontsource-variable/roboto-flex/full.css';
import '@/assets/styles/base.css';

import 'virtual:svg-icons-register';


import App from './app.vue';

validateConfig();

registerComponent('i88-chart');


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true });
app.use(createAppHead({ appName: 'i88' }));

registerVCalendar(app);

app.mount('#app');
