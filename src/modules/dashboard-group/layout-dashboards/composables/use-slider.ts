import { useElementSize } from '@vueuse/core';
import { ref, computed, watch, type Ref } from 'vue';

export function useSlider(opts: {
	slidesWidth: number[];
	gap: number;
	viewportEl: Ref<HTMLElement | null, HTMLElement | null>;
}) {
	const { slidesWidth: slides, gap, viewportEl } = opts;
	const translateX = ref(0);

	const { width: viewportWidth } = useElementSize(viewportEl);

	// общая ширина трека
	const totalTrackWidth = computed(() => {
		const cardSum = slides.reduce((s, c) => s + (c || 0), 0);
		const gaps = Math.max(0, slides.length - 1) * gap;
		return cardSum + gaps;
	});

	// ограничение движения
	function clampTranslate(x: number) {
		const maxTranslate = 0;
		const minTranslate = Math.min(0, viewportWidth.value - totalTrackWidth.value);
		return Math.max(minTranslate, Math.min(maxTranslate, x));
	}

	function setTranslateX(x: number) {
		translateX.value = clampTranslate(x);
	}

	watch(viewportWidth, () => setTranslateX(translateX.value));

	// --- указательные события ---
	const pointer = {
		isDown: false,
		lastX: 0,
		lastY: 0,
		isHorizontal: false,
		hasDirection: false,
	};

	const pointerState = {
		onPointerDown(e: PointerEvent) {
			pointer.isDown = true;
			pointer.lastX = e.clientX;
			pointer.lastY = e.clientY;
			pointer.isHorizontal = false;
			pointer.hasDirection = false;
		},
		onPointerMove(e: PointerEvent) {
			if (!pointer.isDown) {
				return;
			}
			const dx = e.clientX - pointer.lastX;
			const dy = e.clientY - pointer.lastY;

			// Определяем направление только один раз
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
			pointer.isDown = false;
			pointer.hasDirection = false;
		},

		// --- touch-версии ---
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
		},

		// --- wheel (только горизонтальный скролл) ---
		onWheel(e: WheelEvent) {
			const { deltaX, deltaY } = e;
			// если горизонтальный скролл выражен сильнее, чем вертикальный
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				e.preventDefault();
				setTranslateX(translateX.value - deltaX);
			}
		},
	};

	// --- управление кнопками ---
	function getSlideOffset(index: number) {
		const widths = slides.slice(0, index);
		const sum = widths.reduce((s, w) => s + w, 0);
		return -(sum + gap * index);
	}

	const canPrev = computed(() => translateX.value < 0);
	const canNext = computed(() => {
		const minTranslate = viewportWidth.value - totalTrackWidth.value;
		return translateX.value > minTranslate;
	});

	let currentIndex = 0;
	function next() {
		if (!canNext.value) {
			return;
		}
		currentIndex = Math.min(slides.length - 1, currentIndex + 1);
		setTranslateX(getSlideOffset(currentIndex));
	}
	function prev() {
		if (!canPrev.value) {
			return;
		}
		currentIndex = Math.max(0, currentIndex - 1);
		setTranslateX(getSlideOffset(currentIndex));
	}

	return {
		translateX,
		canPrev,
		canNext,
		next,
		prev,
		pointerState,
	};
}
