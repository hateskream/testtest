import type { Component, MaybeRefOrGetter, VNodeChild } from 'vue';
import type { Middleware, Placement, ReferenceElement, Strategy } from '@floating-ui/vue';

import type { createFloatingManager, createFloatingStore } from '@/shared/ui/position/core';

export type FloatingTriggers = 'click' | 'hover' | 'contextmenu';
export type FloatingContentRenderable = VNodeChild | Component | null | undefined;

export type FloatingStore = ReturnType<typeof createFloatingStore>;
export type FloatingManager = ReturnType<typeof createFloatingManager>;

export interface IFloatingOptions {
	scope?: string;
	placement?: Placement;
	strategy?: Strategy;
	offset?: number;
	middleware?: Middleware[];
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
