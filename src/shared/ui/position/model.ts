import type { Placement } from '@floating-ui/vue';
import type { InjectionKey } from 'vue';

import type { FloatingTriggers } from '@/app/plugins/floating';

export interface IPositionProps {
	position?: Placement;
	trigger?: FloatingTriggers | FloatingTriggers[];
	showInMs?: number;
	hideDelayMs?: number;
	positionOffset?: number;
	strategy?: 'fixed' | 'absolute';
	hoverPadding?: number;
}

export interface IInjectionContext {
	close: (immediate?: boolean) => void;
}

export const POSITION_INJECTION_KEY: InjectionKey<IInjectionContext> = Symbol.for('POSITION_INJECTION_KEY');
