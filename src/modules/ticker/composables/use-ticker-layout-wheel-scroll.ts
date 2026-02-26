import { type MaybeRefOrGetter, ref, type Ref, toValue } from 'vue';
import { noop, useEventListener } from '@vueuse/core';

import { isScrolledToBottom, isScrolledToTop, isScrollingDown, isScrollingUp } from '@/shared/lib/scroll.ts';


function getScrollableAncestor(el: HTMLElement | null, container: HTMLElement): HTMLElement | null {
	let current = el;

	while (current && current !== container) {
		const { overflowY } = getComputedStyle(current);

		if ((overflowY === 'auto' || overflowY === 'scroll') && current.scrollHeight > current.clientHeight) {
			return current;
		}

		current = current.parentElement;
	}

	return null;
}

export type UseTickerLayoutWheelScrollOptions = {
	onScroll?: (delta: number) => void;

	/**
	 * Обрабатывать wheel вложенных элементов
	 */
	handleNestedScrolls?: MaybeRefOrGetter<boolean>;
};

export function useTickerLayoutWheelScroll(
	containerRef: Ref<HTMLElement | null>,
	options: UseTickerLayoutWheelScrollOptions = {},
) {
	const {
		onScroll = noop,
		handleNestedScrolls = false,
	} = options;

	const lastTouchY = ref<number | null>(null);

	function handleWheel(event: WheelEvent) {
		const container = toValue(containerRef);
		if (!container) {
			return;
		}

		if (event.ctrlKey) {
			return;
		}

		if (toValue(handleNestedScrolls)) {
			const scrollable = getScrollableAncestor(event.target as HTMLElement, container);

			if (scrollable) {
				const atTop = isScrolledToTop(scrollable) && isScrollingUp(event.deltaY);
				const atBottom = isScrolledToBottom(scrollable) && isScrollingDown(event.deltaY);

				if (!atTop && !atBottom) {
					return;
				}
			}
		}

		onScroll(event.deltaY);
	}

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

		event.preventDefault();

		const currentY = event.touches[0].clientY;
		onScroll(lastTouchY.value - currentY);

		lastTouchY.value = currentY;
	}

	function handleTouchEnd() {
		lastTouchY.value = null;
	}

	useEventListener(containerRef, 'wheel', handleWheel, { passive: false });
	useEventListener(containerRef, 'touchstart', handleTouchStart, { passive: false });
	useEventListener(containerRef, 'touchmove', handleTouchMove, { passive: false });
	useEventListener(containerRef, 'touchend', handleTouchEnd, { passive: false });
}
