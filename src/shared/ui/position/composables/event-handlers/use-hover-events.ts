import { type MaybeRefOrGetter, toValue } from 'vue';

export interface IUseHoverEventsOptions {
	isPinned: MaybeRefOrGetter<boolean>;
	openDelay?: MaybeRefOrGetter<number>;
	closeDelay?: MaybeRefOrGetter<number>;
	triggerRef?: MaybeRefOrGetter<HTMLElement | null>;
	show: () => void;
	hide: () => void;
}

export interface IUseHoverEventsReturn {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onFloatingEnter: () => void;
	onFloatingLeave: (event: MouseEvent) => void;
	clearTimers: () => void;
}

export function useHoverEvents(options: IUseHoverEventsOptions): IUseHoverEventsReturn {
	const {
		triggerRef,
		isPinned,
		show,
		hide,
		openDelay = 200,
		closeDelay = 100,
	} = options;

	let showTimer: number | null = null;
	let hideTimer: number | null = null;

	function clearTimers() {
		if (showTimer) {
			clearTimeout(showTimer);
			showTimer = null;
		}
		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}
	}

	function scheduleShow() {
		clearTimers();
		const delay = toValue(openDelay);
		if (delay > 0) {
			showTimer = setTimeout(() => {
				show();
				showTimer = null;
			}, delay);
		} else {
			show();
		}
	}

	function scheduleHide() {
		clearTimers();
		const delay = toValue(closeDelay);
		if (delay > 0) {
			hideTimer = setTimeout(() => {
				hide();
				hideTimer = null;
			}, delay);
		} else {
			hide();
		}
	}

	function onMouseEnter() {
		if (toValue(isPinned)) {
			return;
		}
		scheduleShow();
	}

	function onMouseLeave() {
		if (toValue(isPinned)) {
			return;
		}
		scheduleHide();
	}

	function onFloatingEnter() {
		if (toValue(isPinned)) {
			return;
		}

		scheduleShow();
	}

	function onFloatingLeave(event: MouseEvent) {
		if (toValue(isPinned)) {
			return;
		}

		const related = event.relatedTarget as HTMLElement | null;
		const trigger = toValue(triggerRef);

		if (trigger && related && trigger.contains(related)) {
			return;
		}

		scheduleHide();
	}

	return {
		onMouseEnter,
		onMouseLeave,
		onFloatingEnter,
		onFloatingLeave,
		clearTimers,
	};
}
