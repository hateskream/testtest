import { ref, type Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

type ScrollCallback = (delta: number) => void;

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

export function useCustomScroll(container: Ref<HTMLElement | null>, onScroll: ScrollCallback) {
	const lastTouchY = ref<number | null>(null);

	const handleWheel = (e: WheelEvent) => {
		if (!container.value) {
			return;
		}

		if (e.ctrlKey) {
			return;
		}

		const scrollable = getScrollableAncestor(e.target as HTMLElement, container.value);

		if (scrollable) {
			const atTop = scrollable.scrollTop === 0 && e.deltaY < 0;
			const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight && e.deltaY > 0;
			if (!atTop && !atBottom) {
				return;
			}
		}

		e.preventDefault();
		onScroll(e.deltaY);
	};

	const handleTouchStart = (e: TouchEvent) => {
		if (!container.value) {
			return;
		}
		lastTouchY.value = e.touches[0].clientY;
	};

	const handleTouchMove = (e: TouchEvent) => {
		if (!container.value || lastTouchY.value === null) {
			return;
		}

		e.preventDefault();
		const currentY = e.touches[0].clientY;
		onScroll(lastTouchY.value - currentY);
		lastTouchY.value = currentY;
	};

	const handleTouchEnd = () => {
		lastTouchY.value = null;
	};

	useEventListener(container, 'wheel', handleWheel, { passive: false });
	useEventListener(container, 'touchstart', handleTouchStart, { passive: false });
	useEventListener(container, 'touchmove', handleTouchMove, { passive: false });
	useEventListener(container, 'touchend', handleTouchEnd, { passive: false });
}
