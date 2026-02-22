import { type MaybeRef, onBeforeUnmount, ref, toValue, watch } from 'vue';
import { useEventListener, useTimeoutFn } from '@vueuse/core';

export function useHoverWheelScroll(
	elementRef: MaybeRef<HTMLElement | null | undefined>,
) {
	let abortController: AbortController | null = null;

	function createAbortControllerSignal() {
		if (abortController) {
			abortController.abort();
		}

		abortController = new AbortController();
		return abortController.signal;
	}

	function cancelAbortControllerSignal() {
		if (abortController) {
			abortController.abort();
			abortController = null;
		}
	}

	const wheelIsActive = ref(false);

	const { start: enableWheel, stop: disableWheel } = useTimeoutFn(
		() => {
			wheelIsActive.value = true;
		},
		500,
		{ immediate: false },
	);

	function onMouseEnter() {
		enableWheel();
	}

	function onMouseLeave() {
		disableWheel();
		wheelIsActive.value = false;
	}

	function onWheel(e: WheelEvent) {
		const target = toValue(elementRef);
		if (target) {
			if (e.shiftKey) {
				target.scrollLeft += e.deltaY;
			} else {
				target.scrollTop += e.deltaY;
			}

			e.stopPropagation();
			e.preventDefault();
		}
	}

	watch(wheelIsActive, value => {
		if (value) {
			const target = toValue(elementRef);
			if (target && target.scrollHeight >= target.clientHeight) {
				target.addEventListener('wheel', onWheel, { signal: createAbortControllerSignal() });
			}
		} else {
			cancelAbortControllerSignal();
		}
	});

	watch(() => toValue(elementRef), value => {
		if (!value) {
			cancelAbortControllerSignal();
			disableWheel();
		}
	});

	onBeforeUnmount(() => {
		cancelAbortControllerSignal();
		disableWheel();
	});

	useEventListener(elementRef, 'mouseenter', onMouseEnter);
	useEventListener(elementRef, 'mouseleave', onMouseLeave);

	return {
		wheelIsActive,
	};
}
