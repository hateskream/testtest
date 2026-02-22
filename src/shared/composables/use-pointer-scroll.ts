import { useEventListener, useResizeObserver } from '@vueuse/core';
import { type MaybeRef, onMounted, reactive, toValue, watch } from 'vue';

type UsePointerScrollOptions = {
	dragThreshold?: number;
};

const STATE_THRESHOLD_PIXELS = 1;

export function usePointerScroll(
	scrollableRef: MaybeRef<HTMLElement | null | undefined>,
	options: UsePointerScrollOptions,
) {
	const {
		dragThreshold = 4,
	} = options;

	const state = reactive({
		isDown: false,
		isDragging: false,
		isOverflowing: false,
		startX: 0,
		startScroll: 0,
		pointerId: null as (number | null),
		left: false,
		right: false,
	});

	function updateState(target: HTMLElement) {
		state.left = target.scrollLeft <= STATE_THRESHOLD_PIXELS;
		state.right = (target.scrollLeft + target.clientWidth) >= (target.scrollWidth - STATE_THRESHOLD_PIXELS);
	}

	// overflow

	function checkOverflow() {
		const el = toValue(scrollableRef);
		if (!el) {
			state.isOverflowing = false;
			return;
		}

		state.isOverflowing = el.scrollWidth > el.clientWidth;
	}

	useResizeObserver(scrollableRef, checkOverflow);

	watch(
		() => state.isOverflowing,
		(val) => {
			if (!val) {
				state.isDown = false;
				state.isDragging = false;
				state.pointerId = null;

				const el = toValue(scrollableRef);
				if (el) {
					el.scrollTo({ left: 0, top: 0 });
				}
			}
		},
	);

	// scroll handlers

	function onPointerDown(e: PointerEvent) {
		if (!state.isOverflowing) {
			return;
		}

		const scrollableEl = toValue(scrollableRef);
		if (!scrollableEl) {
			return;
		}


		state.isDown = true;
		state.isDragging = false;
		state.startX = e.clientX;
		state.startScroll = scrollableEl.scrollLeft;
		state.pointerId = e.pointerId;
	}

	function onPointerMove(e: PointerEvent) {
		if (!state.isDown || !state.isOverflowing) {
			return;
		}

		const scrollableEl = toValue(scrollableRef);
		if (!scrollableEl) {
			return;
		}

		const dx = e.clientX - state.startX;

		if (!state.isDragging) {
			if (Math.abs(dx) < dragThreshold) {
				return;
			}

			state.isDragging = true;

			if (scrollableEl.setPointerCapture) {
				scrollableEl.setPointerCapture(state.pointerId!);
			}
		}

		if (state.isDragging) {
			e.preventDefault();
			e.stopPropagation();
			scrollableEl.scrollLeft = state.startScroll - dx;
		}

	}

	function onPointerUp() {
		if (!state.isOverflowing) {
			return;
		}

		const scrollableEl = toValue(scrollableRef);
		if (!scrollableEl) {
			return;
		}

		if (state.pointerId !== null && scrollableEl.releasePointerCapture) {
			scrollableEl.releasePointerCapture(state.pointerId);
		}

		state.isDown = false;
		state.isDragging = false;
		state.pointerId = null;
	}

	function onScroll() {
		const element = toValue(scrollableRef);
		if (element) {
			updateState(element);
		}
	}

	function onTouchMove(e: TouchEvent) {
		e.preventDefault();
		e.stopPropagation();
	}

	useEventListener(scrollableRef, 'pointerdown', onPointerDown);
	useEventListener(scrollableRef, 'pointermove', onPointerMove);
	useEventListener(scrollableRef, 'pointerup', onPointerUp);
	useEventListener(scrollableRef, 'pointercancel', onPointerUp);
	useEventListener(scrollableRef, 'touchmove', onTouchMove);
	useEventListener(scrollableRef, 'scroll', onScroll);

	onMounted(() => {
		const element = toValue(scrollableRef);
		if (element) {
			updateState(element);
		}
	});

	return {
		state,
		checkOverflow,
	};
}
