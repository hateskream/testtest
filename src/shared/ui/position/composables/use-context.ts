import { inject, provide } from 'vue';

import type { IPositionRootContext } from '@/shared/ui/position';

const CONTEXT_MENU_KEY = Symbol('CONTEXT_MENU');

export function useProvideContext(value: IPositionRootContext) {
	provide<IPositionRootContext>(CONTEXT_MENU_KEY, value);
}

export function useFloatingContext() {
	const menu = inject<IPositionRootContext>(CONTEXT_MENU_KEY);

	if (!menu) {
		throw new Error('PositionTrigger must be inside PositionRoot');
	}

	return menu;
}
