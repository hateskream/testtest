import { inject, provide, type InjectionKey } from 'vue';

const key: InjectionKey<boolean> = Symbol('widget-resize');

export function createResizeContext(data: boolean) {
	provide(key, data);
}

export const useResizeContext = () => inject(key)!;
