import { ref, computed, watch, type MaybeRefOrGetter, toValue, type ShallowRef, readonly } from 'vue';
import debounce from 'lodash/debounce';

const PADDING_VIEWPORT = 52 + 20 + 2 + 13 + 6;

export function useSlider(opts: {
	slidesWidth: MaybeRefOrGetter<number[]>;
	gap?: number;
	viewportWidth: MaybeRefOrGetter<number>;
	isMobile: ShallowRef<boolean, boolean>;
}) {
	const { slidesWidth, gap = 0, viewportWidth, isMobile } = opts;

	const translateX = ref(0);
	const isDragging = ref(false);
	const slides = computed(() => toValue(slidesWidth));
	const currentIndex = ref(0);

	const totalTrackWidth = computed(() => {
		const cardSum = slides.value.reduce((s, c) => s + (c || 0), 0);
		const gaps = Math.max(0, slides.value.length - 1) * gap;
		return cardSum + gaps + (isMobile.value ? 0 : PADDING_VIEWPORT);
	});

	const slideOffsets = computed(() => {
		const offsets: number[] = [];
		let acc = 0;
		for (let i = 0; i < slides.value.length; i += 1) {
			offsets.push(-acc);
			acc += (slides.value[i] || 0) + gap;
		}
		return offsets;
	});

	watch(() => toValue(viewportWidth), () => setTranslateX(translateX.value));

	const seenSlides = new Set<number>();

	const visibleSlidesCount = computed(() => {
		const vp = toValue(viewportWidth) - (isMobile.value ? 0 : PADDING_VIEWPORT - 45);

		const offset = -translateX.value;
		const end = offset + vp;

		let acc = 0;

		for (let i = 0; i < slides.value.length; i += 1) {
			const w = slides.value[i];
			const s = acc;
			const e = acc + w;

			if (e > offset && s < end) {
				seenSlides.add(i);
			}

			acc += w + gap;
		}

		return seenSlides.size;
	});

	function clampTranslate(x: number) {
		const maxTranslate = 0;
		const minTranslate = Math.min(0, toValue(viewportWidth) - totalTrackWidth.value);
		return Math.max(minTranslate, Math.min(maxTranslate, x));
	}

	function setTranslateX(x: number) {
		translateX.value = clampTranslate(x);
	}

	function nearestIndexFromTranslate(x: number) {
		const offsets = slideOffsets.value;
		if (!offsets.length) {
			return 0;
		}

		let best = 0;
		let bestDist = Math.abs(x - offsets[0]);

		for (let i = 1; i < offsets.length; i += 1) {
			const d = Math.abs(x - offsets[i]);
			if (d < bestDist) {
				bestDist = d;
				best = i;
			}
		}
		return best;
	}

	const canPrev = computed(() => translateX.value < 0);
	const canNext = computed(() => {
		const minTranslate = toValue(viewportWidth) - totalTrackWidth.value;
		return translateX.value > minTranslate;
	});

	watch(
		() => translateX.value,
		(newX) => {
			if (isDragging.value) {
				return;
			}

			const nearest = nearestIndexFromTranslate(newX);
			if (nearest !== currentIndex.value) {
				currentIndex.value = nearest;
			}
		},
	);

	function snapToIndex(index: number) {
		const clamped = Math.max(0, Math.min(slides.value.length - 1, index));
		currentIndex.value = clamped;
		setTranslateX(getSlideOffset(clamped));
	}

	function next() {
		if (canNext.value) {
			snapToIndex(currentIndex.value + 1);
		}
	}

	function prev() {
		if (canPrev.value) {
			snapToIndex(currentIndex.value - 1);
		}
	}

	function goTo(index: number) {
		if (index >= 0 && index < slides.value.length) {
			snapToIndex(index);
		}
	}

	function getSlideOffset(index: number) {
		const widths = slides.value.slice(0, index);
		const sum = widths.reduce((s, w) => s + w, 0);
		return -(sum + gap * index);
	}

	const wheelScrolling = ref(false);

	const endWheel = debounce(() => {
		wheelScrolling.value = false;
	}, 120);

	function onWheelStart() {
		wheelScrolling.value = true;
		endWheel();
	}

	const supportsPointer = typeof window !== 'undefined' && 'PointerEvent' in window;

	const pointer = {
		isDown: false,
		lastX: 0,
		startX: 0,
		lastY: 0,
		isHorizontal: false,
		hasDirection: false,
	};

	const pointerHandlers = {
		onPointerDown(e: PointerEvent | MouseEvent | TouchEvent) {
			pointer.isDown = true;
			isDragging.value = true;

			if (supportsPointer) {
				const ev = e as PointerEvent;
				pointer.lastX = ev.clientX;
				pointer.startX = ev.clientX;
				pointer.lastY = ev.clientY;
			} else if (e instanceof TouchEvent) {
				pointer.lastX = e.touches[0].clientX;
				pointer.startX = e.touches[0].clientX;
				pointer.lastY = e.touches[0].clientY;
			} else {
				const ev = e as MouseEvent;
				pointer.lastX = ev.clientX;
				pointer.startX = ev.clientX;
				pointer.lastY = ev.clientY;
			}

			pointer.isHorizontal = false;
			pointer.hasDirection = false;
		},

		onPointerMove(e: PointerEvent | MouseEvent | TouchEvent) {
			if (!pointer.isDown) {
				return;
			}

			let x: number, y: number;

			if (supportsPointer) {
				const ev = e as PointerEvent;
				x = ev.clientX;
				y = ev.clientY;
			} else if (e instanceof TouchEvent) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				const ev = e as MouseEvent;
				x = ev.clientX;
				y = ev.clientY;
			}

			const dx = x - pointer.lastX;
			const dy = y - pointer.lastY;

			if (!pointer.hasDirection) {
				pointer.hasDirection = true;
				pointer.isHorizontal = Math.abs(dx) > Math.abs(dy);
			}

			if (pointer.isHorizontal) {
				e.preventDefault();
				setTranslateX(translateX.value + dx);
			}

			pointer.lastX = x;
			pointer.lastY = y;
		},

		onPointerUp() {
			pointer.isDown = false;
			pointer.hasDirection = false;
			isDragging.value = false;

			if (wheelScrolling.value) {
				return;
			}

			const nearest = nearestIndexFromTranslate(translateX.value);
			snapToIndex(nearest);
		},

		onWheel(e: WheelEvent) {
			onWheelStart();

			const { deltaX, deltaY, shiftKey } = e;
			const smoothFactor = shiftKey ? 0.25 : 1;

			const primaryDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

			e.preventDefault();
			setTranslateX(translateX.value - primaryDelta * smoothFactor);
		},
	};

	const pointerState = (() => {
		if (supportsPointer) {
			return {
				onPointerDown: pointerHandlers.onPointerDown,
				onPointerMove: pointerHandlers.onPointerMove,
				onPointerUp: pointerHandlers.onPointerUp,
				onPointerCancel: pointerHandlers.onPointerUp,
				onWheel: pointerHandlers.onWheel,
			};
		} else {
			return {
				onTouchStart: pointerHandlers.onPointerDown,
				onTouchMove: pointerHandlers.onPointerMove,
				onTouchEnd: pointerHandlers.onPointerUp,
				onMouseDown: pointerHandlers.onPointerDown,
				onMouseMove: pointerHandlers.onPointerMove,
				onMouseUp: pointerHandlers.onPointerUp,
				onWheel: pointerHandlers.onWheel,
			};
		}
	})();

	watch(() => toValue(viewportWidth), () => {
		setTranslateX(translateX.value);
		setTranslateX(getSlideOffset(currentIndex.value));
	});

	return {
		translateX: readonly(translateX),
		canPrev,
		canNext,
		next,
		prev,
		pointerState,
		goTo,
		currentIndex,
		isDragging,
		visibleSlidesCount,
	};
}
