import { type MaybeRefOrGetter, type VNode } from 'vue';
import {
	type Middleware,
	type Placement,
	type Strategy,
} from '@floating-ui/vue';

export type FloatingTrigger = 'click' | 'hover';

export interface IFloatingOptions {
	placement?: Placement;
	strategy?: Strategy;
	offset?: number;
	hoverPadding?: number;
	middleware?: Middleware[];
	showInMs?: number;
	hideDelayMs?: number;
	trigger?: FloatingTrigger;
}

export interface IFloatingSession {
	id: number;
	reference: HTMLElement | null;
	content: (() => VNode[] | VNode | null | undefined) | null;
	options: IFloatingOptions;
	onClose?: () => void;
}

export interface IFloatingOpenPayload {
	reference: MaybeRefOrGetter<HTMLElement | null>;
	content: (() => VNode | VNode[] | null) | null;
	options?: IFloatingOptions;
	onClose?: () => void;
}
