import { inject, type InjectionKey } from 'vue';

import { createFloatingStore } from '@/app/plugins/floating/core.ts';

type Store = ReturnType<typeof createFloatingStore>;

export const FLOATING_KEY: InjectionKey<Store> =
	Symbol.for('FLOATING_INJECTION_KEY')
;

export function useFloatingContext() {
	const id = inject(FLOATING_KEY);
	if (!id) {
		throw new Error(`injection key ${FLOATING_KEY.toString()} not found`);
	}
	return id;
}
