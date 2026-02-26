import { type MaybeRefOrGetter, ref, type Ref, toValue, watch } from 'vue';
import { useEventListener, useScroll } from '@vueuse/core';

import { isScrollingDown, isScrollingUp, preventDefaultScrollBehavior } from '@/shared/lib/scroll.ts';
import { useTickerLayout } from './use-ticker-layout.ts';

export type UseTickerLayoutTouchScrollOptions = {
	disabled?: MaybeRefOrGetter<boolean>;
};

export function useTickerLayoutTouchScroll(
	containerRef: Ref<HTMLElement | null>,
	options: UseTickerLayoutTouchScrollOptions = {},
) {
	const { disabled = false } = options;

	const { setBottomReached, handleFooterScroll, isInReportsMode } = useTickerLayout();

	const lastTouchY = ref<number | null>(null);

	const { arrivedState } = useScroll(containerRef);

	function isAtBottom() {
		return arrivedState.bottom;
	}

	function isAtTop() {
		return arrivedState.top;
	}

	function onContainerScroll(event: WheelEvent) {
		if (toValue(disabled)) {
			preventDefaultScrollBehavior(event);
			return;
		}

		if (!isInReportsMode.value) {
			event.preventDefault();
			return;
		}

		setBottomReached(isAtBottom());

		if (isAtTop() && isScrollingUp(event.deltaY)) {
			return;
		}

		if (isAtBottom() && isScrollingDown(event.deltaY)) {
			handleFooterScroll(event.deltaY);
			return;
		}

		preventDefaultScrollBehavior(event);
		containerRef.value!.scrollTop += event.deltaY;
	}

	watch(() => arrivedState.bottom, setBottomReached, { immediate: true });

	useEventListener(containerRef, 'wheel', onContainerScroll, { passive: false });

	function handleTouchStart(event: TouchEvent) {
		if (!containerRef.value) {
			return;
		}

		lastTouchY.value = event.touches[0].clientY;
	}

	function handleTouchMove(event: TouchEvent) {
		if (!containerRef.value || lastTouchY.value === null) {
			return;
		}

		if (toValue(disabled)) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		const currentY = event.touches[0].clientY;
		const dy = lastTouchY.value - currentY;

		if (arrivedState.top && !isInReportsMode.value) {
			event.preventDefault();
			return;
		}

		if (arrivedState.top && isScrollingUp(dy)) {
			return;
		}

		if (arrivedState.bottom && isScrollingDown(dy)) {
			return;
		}

		lastTouchY.value = currentY;
		event.stopPropagation();
	}

	function handleTouchEnd() {
		lastTouchY.value = null;
	}

	useEventListener(containerRef, 'touchstart', handleTouchStart, { passive: false });
	useEventListener(containerRef, 'touchmove', handleTouchMove, { passive: false });
	useEventListener(containerRef, 'touchend', handleTouchEnd, { passive: false });
}
