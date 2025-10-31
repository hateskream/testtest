import { shallowReactive } from 'vue';

import { createFloatingStore } from './store.ts';
import type { FloatingStore } from '../model';

export function createFloatingManager() {
	const scopes = shallowReactive(new Map<string, FloatingStore>());

	function ensureScope(scope: string) {
		if (!scopes.has(scope)) {
			scopes.set(scope, createFloatingStore(scope));
		}
		return scopes.get(scope)!;
	}

	return {
		scopes,
		ensureScope,
	};
}
