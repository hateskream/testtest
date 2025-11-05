import type { Placement, Strategy } from '@floating-ui/vue';

import type { FloatingTriggers, IFloatingOptions } from './global-position';

export type IPositionProps = IFloatingOptions;

export interface IPositionRootProps {
	trigger: FloatingTriggers | FloatingTriggers[];
	openDelay?: number;
	closeDelay?: number;
}

export interface IPositionContentProps {
	placement?: Placement;
	offset?: number;
	strategy?: Strategy;
}

export interface IPositionTeleportProps {
	to?: string;
	disabled?: boolean;
	defer?: boolean;
}
