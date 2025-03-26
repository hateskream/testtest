import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import '@/assets/styles/base.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'virtual:svg-icons-register';

import routes from './routes';

import App from './app.vue';

const app = createApp(App);

app.use(createPinia());
app.use(routes);
app.use(VueQueryPlugin);

app.mount('#app');
