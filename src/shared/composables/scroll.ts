import { ref, type Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

type ScrollCallback = (offset: number) => void;

function getScrollableAncestor(el: HTMLElement | null, container: HTMLElement): HTMLElement | null {
	let curEL = el;
	while (curEL && curEL !== container) {
		const style = getComputedStyle(curEL);
		const { overflowY } = style;
		if ((overflowY === 'auto' || overflowY === 'scroll') && curEL.scrollHeight > curEL.clientHeight) {
			return curEL;
		}
		curEL = curEL.parentElement;
	}
	return null;
}
export function useCustomScroll(container: Ref<HTMLElement | null>, onScroll: ScrollCallback) {
	const lastTouchY = ref<number | null>(null);

	const handleScroll = (delta: number) => {
		onScroll(delta);
	};
	const onWheel = (e: WheelEvent) => {
		const target = e.target as HTMLElement;
		const scrollableAncestor = getScrollableAncestor(target, container.value!);

		if (scrollableAncestor) {
			const atTop = scrollableAncestor.scrollTop === 0 && e.deltaY < 0;
			const atBottom =
				scrollableAncestor.scrollTop + scrollableAncestor.clientHeight >= scrollableAncestor.scrollHeight &&
				e.deltaY > 0;
			if (!atTop && !atBottom) {
				return;
			}
		}

		e.preventDefault();
		handleScroll(e.deltaY);
	};

	const onTouchStart = (e: TouchEvent) => {
		lastTouchY.value = e.touches[0].clientY;
	};

	const onTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		const currentY = e.touches[0].clientY;
		if (lastTouchY.value !== null) {
			handleScroll(lastTouchY.value - currentY);
		}
		lastTouchY.value = currentY;
	};

	const onTouchEnd = () => {
		lastTouchY.value = null;
	};

	useEventListener(container, 'wheel', onWheel, { passive: false });
	useEventListener(container, 'touchstart', onTouchStart, { passive: false });
	useEventListener(container, 'touchmove', onTouchMove, { passive: false });
	useEventListener(container, 'touchend', onTouchEnd, { passive: false });
}
