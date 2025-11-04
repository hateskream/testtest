import { type MaybeRefOrGetter, toValue } from 'vue';

export interface IUseHoverEventsOptions {
	isPinned: MaybeRefOrGetter<boolean>;
	openDelay?: MaybeRefOrGetter<number>;
	closeDelay?: MaybeRefOrGetter<number>;
	triggerRef?: MaybeRefOrGetter<HTMLElement | null>;
	show: () => void;
	hide: () => void;
}

export function useHoverEvents(options: IUseHoverEventsOptions) {
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

	function onMouseEnter() {
		if (toValue(isPinned)) {
			return;
		}

		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}

		if (showTimer) {
			return;
		}

		const delay = toValue(openDelay);
		if (delay > 0) {
			showTimer = window.setTimeout(() => {
				show();
				showTimer = null;
			}, delay);
		} else {
			show();
		}
	}

	function onMouseLeave() {
		if (toValue(isPinned)) {
			return;
		}

		if (showTimer) {
			clearTimeout(showTimer);
			showTimer = null;
		}

		const delay = toValue(closeDelay);
		if (delay > 0) {
			hideTimer = window.setTimeout(() => {
				hide();
				hideTimer = null;
			}, delay);
		} else {
			hide();
		}
	}

	function onFloatingEnter() {
		if (toValue(isPinned)) {
			return;
		}

		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}
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

		onMouseLeave();
	}

	return {
		onMouseEnter,
		onMouseLeave,
		onFloatingEnter,
		onFloatingLeave,
		clearTimers,
	};
}
