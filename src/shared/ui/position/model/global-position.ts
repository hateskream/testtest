import type { Middleware, Placement, Strategy } from '@floating-ui/vue';

export type FloatingTriggers = 'click' | 'hover' | 'contextmenu';

export interface IFloatingOptions {
	placement?: Placement;
	strategy?: Strategy;
	offset?: number;
	middleware?: Middleware[];
	trigger?: FloatingTriggers | FloatingTriggers[];
	openDelay?: number;
	closeDelay?: number;
}
