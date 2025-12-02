import {
	ref,
	computed,
	watch,
	type MaybeRefOrGetter,
	toValue,
	type ShallowRef,
	readonly,
	onBeforeUnmount,
	onMounted,
} from 'vue';
import throttle from 'lodash/throttle';


const PADDING_VIEWPORT = 52 + 20 + 2 + 13 + 6;

export function useSlider(opts: {
	slidesWidth: MaybeRefOrGetter<number[]>;
	gap?: number;
	viewportWidth: MaybeRefOrGetter<number>;
	container: MaybeRefOrGetter<HTMLDivElement | null>;
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

	const seenSlides = new Set<number>();

	const visibleSlidesCount = ref(0);

	const canPrev = computed(() => translateX.value < 0);
	const canNext = computed(() => {
		const minTranslate = toValue(viewportWidth) - totalTrackWidth.value;
		return translateX.value > minTranslate;
	});

	function clampTranslate(x: number) {
		const maxTranslate = 0;
		const minTranslate = Math.min(0, toValue(viewportWidth) - totalTrackWidth.value);
		return Math.max(minTranslate, Math.min(maxTranslate, x));
	}

	let raf = 0;
	function setTranslateXRAF(x: number) {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			setTranslateX(x);
		});
	}


	function setTranslateX(x: number) {
		if (isMobile.value) {
			translateX.value = nearestIndexFromTranslate(clampTranslate(x));
			return;
		}

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

	let currentX = 0;
	let startX = 0;

	function onPointerDown(e: PointerEvent) {
		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		isDragging.value = true;
		startX = e.clientX - currentX;
		el.setPointerCapture(e.pointerId);
	}

	let lastUpdate = 0;


	function onPointerMove(e: PointerEvent) {
		const now = performance.now();
		if (now - lastUpdate < 33) {
			// e.preventDefault();
			return;
		}
		lastUpdate = now;

		if (!isDragging.value) {
			return;
		}
		currentX = e.clientX - startX;
		setTranslateXRAF(currentX);
	}

	function onPointerUp(e: PointerEvent) {
		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		isDragging.value = false;
		el.releasePointerCapture(e.pointerId);
	}

	function onWheel(e: WheelEvent) {
		const now = performance.now();
		if (now - lastUpdate < 33) {
			e.preventDefault();
			return;
		}
		lastUpdate = now;

		if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
			return;
		}

		e.preventDefault();

		let delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;

		delta = Math.sign(delta) * Math.min(Math.abs(delta), 60);

		delta *= 1.8;

		currentX -= delta;

		setTranslateXRAF(currentX);
	}

	function updateVisibleSlides() {
		const vp = toValue(viewportWidth) - (isMobile.value ? 0 : PADDING_VIEWPORT - 45);
		const offset = -translateX.value;
		const end = offset + vp;

		let acc = 0;
		for (let i = 0; i < slides.value.length; i++) {
			const w = slides.value[i];
			const s = acc;
			const e = acc + w;

			if (e > offset && s < end) {
				seenSlides.add(i);
			}
			acc += w + gap;
		}

		return seenSlides.size;
	}


	watch(() => toValue(viewportWidth), () => {
		setTranslateXRAF(getSlideOffset(currentIndex.value));
	});

	const updateVisibleSlidesThrottled = throttle(() => {
		visibleSlidesCount.value = updateVisibleSlides();
	}, 60);

	watch(translateX, () => {
		updateVisibleSlidesThrottled();
	});

	onMounted(() => {
		const el = toValue(opts.container);
		if (!el) {
			// eslint-disable-next-line no-console
			console.error('Container not found');
			return;
		}

		const container = el.parentElement!;

		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('pointermove', onPointerMove);
		el.addEventListener('pointerup', onPointerUp);
		el.addEventListener('pointercancel', onPointerUp);

		container.addEventListener('wheel', onWheel, { passive: false });

		onBeforeUnmount(() => {
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', onPointerUp);
			el.removeEventListener('pointercancel', onPointerUp);
			container.removeEventListener('wheel', onWheel);
		});
	});

	return {
		translateX: readonly(translateX),
		canPrev,
		canNext,
		next,
		prev,
		goTo,
		currentIndex,
		isDragging,
		visibleSlidesCount,
	};
}
