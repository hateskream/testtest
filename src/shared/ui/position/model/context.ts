import type { MaybeRefOrGetter, Ref } from 'vue';

import type { FloatingTriggers, IUseHoverEventsReturn } from '@/shared/ui/position';

export interface IPositionRootContext {
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
