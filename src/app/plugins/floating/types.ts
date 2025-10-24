import { type Component, type MaybeRefOrGetter, type VNodeChild } from 'vue';
import {
	type Middleware,
	type Placement, type ReferenceElement,
	type Strategy,
} from '@floating-ui/vue';

export type FloatingTriggers = 'click' | 'hover' | 'contextmenu';
export type FloatingContentRenderable = VNodeChild | Component | null | undefined;

export interface IFloatingOptions {
	placement?: Placement;
	strategy?: Strategy;
	offset?: number;
	hoverPadding?: number;
	middleware?: Middleware[];
	showInMs?: number;
	hideDelayMs?: number;
	trigger?: FloatingTriggers | FloatingTriggers[];
}

export interface IFloatingSession {
	id: number;
	reference: ReferenceElement | null;
	content: (() => FloatingContentRenderable) | null;
	options: IFloatingOptions;
	onClose?: () => void;
}

export interface IFloatingOpenPayload {
	reference: MaybeRefOrGetter<ReferenceElement | null>;
	content: (() => FloatingContentRenderable) | null;
	options?: IFloatingOptions;
	onClose?: () => void;
}
