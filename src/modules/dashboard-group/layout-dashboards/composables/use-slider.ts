import { ref, computed, watch, type MaybeRefOrGetter, toValue, type ShallowRef, readonly } from 'vue';

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
		// FIX ME MAGIC NUMBER
		const vp = toValue(viewportWidth) - (isMobile.value ? 0 : PADDING_VIEWPORT - 45);

		const offset = -translateX.value;
		const end = offset + vp;

		let acc = 0;

		for (let i = 0; i < slides.value.length; i += 1) {
			const w = slides.value[i];

			const slideStart = acc;
			const slideEnd = acc + w;

			const intersects = slideEnd > offset && slideStart < end;

			if (intersects) {
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
		if (!canNext.value) {
			return;
		}
		snapToIndex(currentIndex.value + 1);
	}

	function prev() {
		if (!canPrev.value) {
			return;
		}
		snapToIndex(currentIndex.value - 1);
	}

	function goTo(index: number) {
		if (index < 0 || index >= slides.value.length) {
			return;
		}
		snapToIndex(index);
	}

	function getSlideOffset(index: number) {
		const widths = slides.value.slice(0, index);
		const sum = widths.reduce((s, w) => s + w, 0);
		return -(sum + gap * index);
	}

	const pointer = {
		isDown: false,
		lastX: 0,
		startX: 0,
		lastY: 0,
		isHorizontal: false,
		hasDirection: false,
	};

	const pointerState = {
		onPointerDown(e: PointerEvent) {
			pointer.isDown = true;
			pointer.lastX = e.clientX;
			pointer.startX = e.clientX;
			pointer.lastY = e.clientY;
			pointer.isHorizontal = false;
			pointer.hasDirection = false;
			isDragging.value = true;
		},
		onPointerMove(e: PointerEvent) {
			if (!pointer.isDown) {
				return;
			}
			const dx = e.clientX - pointer.lastX;
			const dy = e.clientY - pointer.lastY;

			if (!pointer.hasDirection) {
				pointer.hasDirection = true;
				pointer.isHorizontal = Math.abs(dx) > Math.abs(dy);
			}

			if (pointer.isHorizontal) {
				e.preventDefault();
				setTranslateX(translateX.value + dx);
			}

			pointer.lastX = e.clientX;
			pointer.lastY = e.clientY;
		},
		onPointerUp() {
			isDragging.value = false;
			pointer.isDown = false;
			pointer.hasDirection = false;

			const nearest = nearestIndexFromTranslate(translateX.value);
			snapToIndex(nearest);
		},

		onTouchStart(e: TouchEvent) {
			pointer.isDown = true;
			pointer.lastX = e.touches[0].clientX;
			pointer.lastY = e.touches[0].clientY;
			pointer.startX = e.touches[0].clientX;
			pointer.isHorizontal = false;
			pointer.hasDirection = false;
			isDragging.value = true;
		},
		onTouchMove(e: TouchEvent) {
			if (!pointer.isDown) {
				return;
			}
			const x = e.touches[0].clientX;
			const y = e.touches[0].clientY;
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
		onTouchEnd() {
			pointer.isDown = false;
			pointer.hasDirection = false;
			isDragging.value = false;

			const nearest = nearestIndexFromTranslate(translateX.value);
			snapToIndex(nearest);
		},

		onWheel(e: WheelEvent) {
			const { deltaX, deltaY } = e;
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				setTranslateX(translateX.value - deltaX);
			}
		},
	};

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
