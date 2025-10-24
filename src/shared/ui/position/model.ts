import type { InjectionKey } from 'vue';

import type { IFloatingOptions } from '@/app/plugins/floating';

export type IPositionProps = IFloatingOptions;

export interface IInjectionContext {
	close: (immediate?: boolean) => void;
}

export const POSITION_INJECTION_KEY: InjectionKey<IInjectionContext> = Symbol.for('POSITION_INJECTION_KEY');
