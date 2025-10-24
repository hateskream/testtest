import { inject, type InjectionKey } from 'vue';

import type { FloatingManager } from '../types';

export const FLOATING_KEY: InjectionKey<FloatingManager> =
	Symbol.for('FLOATING_INJECTION_KEY')
;

export function useFloatingContext(scope = 'default') {
	const manager = inject<FloatingManager>(FLOATING_KEY);

	if (!manager) {
		throw new Error('Floating manager not provided');
	}

	return manager.ensureScope(scope);
}

export function listFloatingScopes() {
	const manager = inject<FloatingManager>(FLOATING_KEY);

	if (!manager) {
		throw new Error('Floating manager not provided');
	}

	return Array.from(manager.scopes.keys());
}
