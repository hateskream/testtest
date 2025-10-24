import { shallowReactive } from 'vue';

import { createFloatingStore } from './store.ts';
import type { FloatingStore } from '@/app/plugins/floating';

const scopes = shallowReactive(new Map<string, FloatingStore>());

export function createFloatingManager() {
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
