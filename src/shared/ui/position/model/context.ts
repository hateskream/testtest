import type { MaybeRefOrGetter, Ref } from 'vue';

import type { FloatingTriggers, IUseHoverEventsReturn } from '@/shared/ui/position';

export interface IFloatingContext {
	isOpen: Ref<boolean>;
	isPinned: Ref<boolean>;
	open: () => void;
	close: () => void;
	registerTrigger: (el: HTMLElement) => void;
	registerContent: (el: HTMLElement) => void;
	triggerRef: Ref<HTMLElement | null>;
	contentRef: Ref<HTMLElement | null>;
	trigger: MaybeRefOrGetter<FloatingTriggers | FloatingTriggers[]>;
	events: {
		hover: IUseHoverEventsReturn;
	};
}

export interface ISubFloatingContext extends IFloatingContext {
	parent?: IFloatingContext | ISubFloatingContext;
	pin: () => void;
	unpin: () => void;
}
