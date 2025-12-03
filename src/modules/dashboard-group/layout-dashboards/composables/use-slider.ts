import {
	ref,
	computed,
	type MaybeRefOrGetter,
	toValue,
	type ShallowRef,
	readonly,
	onBeforeUnmount,
	onMounted,
} from 'vue';
import throttle from 'lodash/throttle';

import { smoothScrollTo } from '@/shared/lib/smooth-scroll';


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
			offsets.push(acc);
			acc += (slides.value[i] || 0) + gap;
		}
		return offsets;
	});

	const seenSlides = new Set<number>();

	const visibleSlidesCount = computed(() => {
		const vp = toValue(viewportWidth) - (isMobile.value ? 0 : PADDING_VIEWPORT - 45);
		const offset = translateX.value;
		const end = offset + vp;

		let acc = 0;
		// eslint-disable-next-line no-plusplus
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
	});

	const canPrev = computed(() => translateX.value > 0);
	const canNext = computed(() => {
		const minTranslate = toValue(viewportWidth) - totalTrackWidth.value;
		return translateX.value > minTranslate;
	});

	function clamp(x: number) {
		const maxScroll = Math.max(0, totalTrackWidth.value - toValue(viewportWidth));
		return Math.max(0, Math.min(maxScroll, x));
	}

	function setScroll(x: number) {
		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		let currentX = clamp(x);

		if (isMobile.value) {
			currentX = nearestIndexFromTranslate(x);
		}

		el.scrollLeft = currentX;
		translateX.value = currentX;
	}

	let RAF = 0;
	function setScrollRAF(scrollX: number) {
		cancelAnimationFrame(RAF);
		RAF = requestAnimationFrame(() => {
			setScroll(scrollX);
		});
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
		const el = toValue(opts.container);

		if (!el) {
			return;
		}

		const clamped = Math.max(0, Math.min(slides.value.length - 1, index));
		currentIndex.value = clamped;

		smoothScrollTo(el, getSlideOffset(clamped), {
			duration: 300,
			axis: 'x',
		});
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
		return sum + gap * index;
	}

	let startX = 0;
	let startScrollLeft = 0;

	function onPointerDown(e: PointerEvent) {
		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		isDragging.value = true;

		startX = e.clientX;
		startScrollLeft = el.scrollLeft;
		el.style.scrollSnapType = 'none';
		el.style.scrollBehavior = 'auto';

		el.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging.value) {
			return;
		}

		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		const dx = e.clientX - startX;
		const nextScroll = startScrollLeft - dx;

		setScrollRAF(nextScroll);
	}

	function onPointerUp(e: PointerEvent) {
		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		isDragging.value = false;
		el.style.scrollSnapType = '';
		el.style.scrollBehavior = '';

		el.releasePointerCapture(e.pointerId);
	}


	function handleScroll() {
		const el = toValue(opts.container);

		if (!el) {
			// eslint-disable-next-line no-console
			console.error('Container not found');
			return;
		}

		translateX.value = el.scrollLeft;
	}

	const throttledHandleScroll = throttle(handleScroll, 33);

	onMounted(() => {
		const el = toValue(opts.container);
		if (!el) {
			// eslint-disable-next-line no-console
			console.error('Container not found');
			return;
		}

		handleScroll();

		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('pointermove', onPointerMove);
		el.addEventListener('pointerup', onPointerUp);
		el.addEventListener('pointercancel', onPointerUp);
		el.addEventListener('scroll', throttledHandleScroll);


		onBeforeUnmount(() => {
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', onPointerUp);
			el.removeEventListener('pointercancel', onPointerUp);
			el.removeEventListener('scroll', throttledHandleScroll);
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
