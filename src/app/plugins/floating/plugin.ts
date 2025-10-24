import { type Plugin } from 'vue';

import { createFloatingStore } from './core.ts';
import { FLOATING_KEY } from './composables/use-floating-context.ts';

export const floatingPlugin: Plugin = {
	install: (app) => {
		const store = createFloatingStore();
		app.provide(FLOATING_KEY, store);
	},
};
