import { effectScope, shallowReactive } from 'vue';

import type { FloatingStore, IFloatingEffectScope } from '../model';
import { createFloatingStore } from './store.ts';
import { useLogger } from '@/shared/service/logger';

export function createFloatingManager() {
	const scopes = shallowReactive(new Map<string, FloatingStore>());
	const meta = new Map<string, IFloatingEffectScope>();

	const logger = useLogger();

	function createScope(scope: string) {
		const effect = effectScope();
		const store = effect.run(() => createFloatingStore(scope)) as FloatingStore;

		scopes.set(scope, store);
		meta.set(scope, { effect, subscribers: 0 });

		logger.info(`Scope "${scope}" created`);
		return store;
	}

	function ensureScope(scope: string) {
		return scopes.get(scope) ?? createScope(scope);
	}

	function retainScope(scope: string) {
		const store = ensureScope(scope);
		const entry = meta.get(scope)!;

		entry.subscribers += 1;
		return store;
	}

	function disposeScope(scope: string) {
		const entry = meta.get(scope);

		if (!entry) {
			return;
		}

		entry.subscribers -= 1;

		if (entry.subscribers <= 0) {
			entry.effect.stop();
			meta.delete(scope);
			scopes.delete(scope);

			logger.info(`Scope ${scope} is clear`);
		}
	}

	return {
		scopes: scopes,
		ensure: ensureScope,
		retain: retainScope,
		dispose: disposeScope,
	};
}
