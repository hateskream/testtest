import type { Placement } from '@floating-ui/vue';

export type PositionTeleport = string | null | false | undefined;

export interface IPositionProps {
	position?: Placement;
	trigger?: 'hover' | 'click';
	showInMs?: number;
	hideDelayMs?: number;
	positionOffset?: number;
	strategy?: 'fixed' | 'absolute';
	hoverPadding?: number;
	teleport?: PositionTeleport;
}

export interface IFloatingContext {
	registerFloating: (element: HTMLElement, level: number) => void;
	unregisterFloating: (element: HTMLElement) => void;
	isInsideFloating: (target: Element) => boolean;
	getCurrentLevel: () => number;
}
