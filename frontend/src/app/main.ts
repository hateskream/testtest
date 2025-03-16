import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import '../assets/styles/base.css';

import routes from './routes';

import App from './app.vue';

const app = createApp(App);

app.use(createPinia());
app.use(routes);
app.use(VueQueryPlugin);

app.mount('#app');
