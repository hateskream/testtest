import type { AutoUpdateOptions, Middleware, Placement, Strategy } from '@floating-ui/vue';

export type FloatingTriggers = 'click' | 'hover' | 'contextmenu';

export interface IPositionProps {
	autoUpdate?: AutoUpdateOptions | boolean;
	placement?: (() => Placement) | Placement;
	strategy?: Strategy;
	offset?: number;
	middleware?: Middleware[];
	trigger?: FloatingTriggers | FloatingTriggers[];
	openDelay?: number;
	closeDelay?: number;
	transform?: boolean;
	memorize?: boolean;
}

export interface IPositionRootProps {
	trigger?: FloatingTriggers | FloatingTriggers[];
	openDelay?: number;
	closeDelay?: number;
}

export interface IPositionContentProps {
	autoUpdate?: AutoUpdateOptions | boolean;
	placement?: (() => Placement) | Placement;
	offset?: number;
	strategy?: Strategy;
	transform?: boolean;
	memorize?: boolean;
}

export interface IPositionTeleportProps {
	to?: string;
	disabled?: boolean;
	defer?: boolean;
}

export type ISubpositionRootProps = IPositionRootProps;

export interface ISubpositionContentProps extends IPositionContentProps {
	hoverPadding?: number;
}

export function parseAutoUpdate(autoUpdate: AutoUpdateOptions | boolean) {
	return typeof autoUpdate === 'boolean' ? {} : autoUpdate;
}
