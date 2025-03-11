import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './app-component.vue';

import routes from './routes';

const app = createApp(App);

app.use(createPinia());
app.use(routes);
app.use(VueQueryPlugin);

app.mount('#app');
