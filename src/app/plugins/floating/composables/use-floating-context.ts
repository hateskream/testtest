import { inject, type InjectionKey } from 'vue';

import { createFloatingStore } from '@/app/plugins/floating/core.ts';

type Store = ReturnType<typeof createFloatingStore>;

export const FLOATING_KEY: InjectionKey<Store> =
	Symbol.for('FLOATING_INJECTION_KEY')
;

export function useInjectFloatingContext() {
	const id = inject(FLOATING_KEY);
	if (!id) {
		throw new Error('No floating context provided');
	}
	return id;
}
