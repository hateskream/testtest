import { inject, onUnmounted, type InjectionKey } from 'vue';

import type { FloatingManager } from '../model';

export const FLOATING_KEY: InjectionKey<FloatingManager> =
	Symbol.for('FLOATING_INJECTION_KEY')
;

export function useFloatingContext(scope = 'default') {
	const manager = inject<FloatingManager>(FLOATING_KEY);

	if (!manager) {
		throw new Error('Floating manager not provided');
	}

	const store = manager.retain(scope);

	onUnmounted(() => {
		manager.dispose(scope);
	});

	return store;
}

export function listFloatingScopes() {
	const manager = inject<FloatingManager>(FLOATING_KEY);

	if (!manager) {
		throw new Error('Floating manager not provided');
	}

	return Array.from(manager.scopes.keys());
}
