import { inject, type InjectionKey, provide } from 'vue';

import type { WidgetState } from '../model';

export interface IWidgetContext {
	updateState: (state: WidgetState) => void;
	setStateType: (stateType: string) => void;
}

const WidgetContextKey: InjectionKey<IWidgetContext> = Symbol('WidgetContext');

export function createWidgetContext(context: IWidgetContext): IWidgetContext {
	provide(WidgetContextKey, context);

	return context;
}

export function useWidgetContext(): IWidgetContext {
	const context = inject(WidgetContextKey);

	if (!context) {
		throw new Error('useWidgetContext must be used within a widget wrapper');
	}

	return context;
}
