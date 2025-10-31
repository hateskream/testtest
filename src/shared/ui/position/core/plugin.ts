import { type Plugin } from 'vue';

import { FLOATING_KEY } from '../composables';
import { createFloatingManager } from '../core';

export const floatingPlugin: Plugin = {
	install: (app) => {
		const manager = createFloatingManager();
		app.provide(FLOATING_KEY, manager);
	},
};
