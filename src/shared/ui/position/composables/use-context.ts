import { inject, provide } from 'vue';

import type { IFloatingContext, ISubFloatingContext } from '@/shared/ui/position';

const CONTEXT_MENU_KEY = Symbol('CONTEXT_MENU');

export function useProvideFloatingContext(value: IFloatingContext) {
	provide<IFloatingContext>(CONTEXT_MENU_KEY, value);
}

export function useFloatingContext() {
	const menu = inject<IFloatingContext>(CONTEXT_MENU_KEY);

	if (!menu) {
		throw new Error('Position components must be inside PositionRoot');
	}

	return menu;
}

export function useProvideSubFloatingContext(value: ISubFloatingContext) {
	provide<ISubFloatingContext>(CONTEXT_MENU_KEY, value);
}

export function useSubFloatingContext() {
	const menu = inject<ISubFloatingContext>(CONTEXT_MENU_KEY);

	if (!menu) {
		throw new Error('Subposition components must be inside SubpositionRoot');
	}

	return menu;
}
