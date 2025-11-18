import { ref, computed, watch, type MaybeRefOrGetter, toValue, type ShallowRef } from 'vue';

const PADDING_VIEWPORT = 44;

export function useSlider(opts: {
	slidesWidth: MaybeRefOrGetter<number[]>;
	gap?: number;
	viewportWidth: ShallowRef<number, number>;
	isMobile: ShallowRef<boolean, boolean>;
}) {
	const { slidesWidth, gap = 0, viewportWidth, isMobile } = opts;
	const translateX = ref(0);
	const isDragging = ref(false);

	const slides = computed(() => toValue(slidesWidth));

	const totalTrackWidth = computed(() => {
		const cardSum = slides.value.reduce((s, c) => s + (c || 0), 0);
		const gaps = Math.max(0, slides.value.length - 1) * gap;
		return cardSum + gaps + (isMobile.value ? 0 : PADDING_VIEWPORT);
	});

	const trackStyle = computed(() => ({
		transform: `translateX(${translateX.value}px)`,
		gap: `${gap}px`,
	}));

	watch(viewportWidth, () => setTranslateX(translateX.value));


	function clampTranslate(x: number) {
		const maxTranslate = 0;
		const minTranslate = Math.min(0, viewportWidth.value - totalTrackWidth.value);
		return Math.max(minTranslate, Math.min(maxTranslate, x));
	}

	function setTranslateX(x: number) {
		translateX.value = clampTranslate(x);
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
		},


		onTouchStart(e: TouchEvent) {
			pointer.isDown = true;
			pointer.lastX = e.touches[0].clientX;
			pointer.lastY = e.touches[0].clientY;
			pointer.isHorizontal = false;
			pointer.hasDirection = false;
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

			if (!isMobile.value) {
				return;
			}

			const dx = pointer.lastX - pointer.startX;

			const isLeft = dx < 0;

			if (Math.abs(dx) < viewportWidth.value / 5) {
				setTranslateX(translateX.value - dx);
				return;
			}

			if (isLeft) {
				next();
			} else {
				prev();
			}
		},


		onWheel(e: WheelEvent) {
			const { deltaX, deltaY } = e;
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				setTranslateX(translateX.value - deltaX);
			}
		},
	};

	function getSlideOffset(index: number) {
		const widths = slides.value.slice(0, index);
		const sum = widths.reduce((s, w) => s + w, 0);
		return -(sum + gap * index);
	}

	const canPrev = computed(() => translateX.value < 0);
	const canNext = computed(() => {
		const minTranslate = viewportWidth.value - totalTrackWidth.value;
		return translateX.value > minTranslate;
	});

	const currentIndex = ref(0);
	function next() {
		if (!canNext.value) {
			return;
		}
		currentIndex.value = Math.min(slides.value.length - 1, currentIndex.value + 1);
		setTranslateX(getSlideOffset(currentIndex.value));
	}
	function prev() {
		if (!canPrev.value) {
			return;
		}
		currentIndex.value = Math.max(0, currentIndex.value - 1);
		setTranslateX(getSlideOffset(currentIndex.value));
	}

	function goTo(index: number) {
		if (index < 0 || index >= slides.value.length) {
			return;
		}

		currentIndex.value = index;
		setTranslateX(getSlideOffset(index));
	}

	return {
		trackStyle,
		canPrev,
		canNext,
		next,
		prev,
		pointerState,
		goTo,
		currentIndex,
		isDragging,
	};
}
