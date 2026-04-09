import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { computed, onBeforeUnmount, readonly, ref, toValue, watch } from 'vue';
import throttle from 'lodash/throttle';

import { smoothScrollTo } from '@/shared/lib/smooth-scroll';
import { useLogger } from '@/shared/service/monitoring';


const LEFT_OFFSET = 20;
const RIGHT_OFFSET = 10 + 10 + 4;
const BORDER_WIDTH = 2;
const SIDEBAR_WIDTH = 52;

const PADDING_VIEWPORT = LEFT_OFFSET + RIGHT_OFFSET + BORDER_WIDTH + SIDEBAR_WIDTH;

export function useSlider(opts: {
	slidesWidth: MaybeRefOrGetter<number[]>;
	gap?: number;
	viewportWidth: MaybeRefOrGetter<number>;
	container: MaybeRefOrGetter<HTMLDivElement | null>;
	isMobile: ShallowRef<boolean, boolean>;
	dragThreshold?: number;
}) {
	const { slidesWidth, gap = 0, viewportWidth, isMobile, dragThreshold = 5 } = opts;

	const logger = useLogger();

	const translateX = ref(0);
	const isDragging = ref(false);
	const slides = computed(() => toValue(slidesWidth));
	const currentIndex = ref(0);

	const totalTrackWidth = computed(() => {
		const cardSum = slides.value.reduce((s, c) => s + (c || 0), 0);
		const gaps = Math.max(0, slides.value.length - 1) * gap;

		return cardSum + gaps + (isMobile.value ? 0 : PADDING_VIEWPORT);
	});

	const seenSlides = new Set<number>();

	const visibleSlidesCount = computed(() => {
		const vp = toValue(viewportWidth) - (isMobile.value ? 0 : PADDING_VIEWPORT - SIDEBAR_WIDTH);
		const offset = translateX.value;
		const end = offset + vp;

		let acc = 0;
		// oxlint-disable-next-line no-plusplus
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
		const maxTranslate = totalTrackWidth.value - toValue(viewportWidth);

		return translateX.value < maxTranslate;
	});

	watch(
		isDragging,
		(value) => {
			const el = toValue(opts.container);
			if (!el) {
				return;
			}

			if (value) {
				el.style.scrollSnapType = 'none';
				el.style.scrollBehavior = 'auto';
			} else {
				el.style.scrollSnapType = '';
				el.style.scrollBehavior = '';
			}
		},
	);

	function clamp(x: number) {
		const maxScroll = Math.max(0, totalTrackWidth.value - toValue(viewportWidth));
		return Math.max(0, Math.min(maxScroll, x));
	}

	function setScroll(x: number) {
		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		const currentX = clamp(x);

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

	function snapToIndex(index: number) {
		const el = toValue(opts.container);

		if (!el) {
			return;
		}

		const clamped = Math.max(0, Math.min(slides.value.length - 1, index));
		currentIndex.value = clamped;

		if (isMobile.value) {
			const currentX = getSlideOffset(clamped);

			el.scrollLeft = currentX;
			translateX.value = currentX;
		} else {
			smoothScrollTo(el, getSlideOffset(clamped), {
				duration: 200,
				axis: 'x',
			});
		}
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
	let moveIsStarted = false;
	let pointerIsDown = false;

	function onPointerDown(e: PointerEvent) {
		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		e.preventDefault();

		startX = e.clientX;
		startScrollLeft = el.scrollLeft;

		moveIsStarted = false;
		pointerIsDown = true;
		isDragging.value = false;
	}

	function onPointerMove(e: PointerEvent) {
		if (!pointerIsDown) {
			return;
		}

		const dx = e.clientX - startX;

		if (!moveIsStarted && Math.abs(dx) > dragThreshold) {
			moveIsStarted = true;
			isDragging.value = true;

			const el = toValue(opts.container);
			if (el) {
				el.setPointerCapture(e.pointerId);
			}
		}

		const nextScroll = startScrollLeft - dx;

		setScrollRAF(nextScroll);
	}

	function onPointerUp(event: PointerEvent) {
		pointerIsDown = false;

		if (!isDragging.value) {
			return;
		}

		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		isDragging.value = false;

		if (el.hasPointerCapture(event.pointerId)) {
			el.releasePointerCapture(event.pointerId);
		}
	}


	function onTouchEnd(e: TouchEvent) {
		if (!isMobile.value) {
			return;
		}

		const endX = e.changedTouches[0].clientX;

		isDragging.value = false;

		swipe(endX);
	}

	function onTouchStart(e: TouchEvent) {
		if (!isMobile.value) {
			return;
		}

		const el = toValue(opts.container);
		if (!el) {
			return;
		}

		isDragging.value = true;

		startX = e.changedTouches[0].clientX;
		startScrollLeft = el.scrollLeft;
	}

	const SWIPE_THRESHOLD = 50;

	function swipe(endX: number) {
		const dx = endX - startX;

		if (Math.abs(dx) < SWIPE_THRESHOLD) {
			snapToIndex(currentIndex.value);
			return;
		}

		if (dx > 0) {
			prev();
		} else {
			next();
		}
	}

	function handleScroll() {
		const el = toValue(opts.container);

		if (!el) {
			logger.error('Container not found');
			return;
		}

		translateX.value = el.scrollLeft;
	}

	const throttledHandleScroll = throttle(handleScroll, 33);

	let abortController: AbortController | null = null;

	watch(() => toValue(opts.container), value => {
		if (value) {
			handleScroll();
			createListeners(value);
		} else {
			clearListeners();
		}
	}, { immediate: true });

	function createListeners(el: HTMLElement) {
		if (abortController) {
			abortController.abort();
		}

		abortController = new AbortController();

		const { signal } = abortController;

		el.addEventListener('pointerdown', onPointerDown, { passive: false, signal });
		el.addEventListener('pointermove', onPointerMove, { signal });
		el.addEventListener('pointerup', onPointerUp, { signal });
		el.addEventListener('pointercancel', onPointerUp, { signal });
		el.addEventListener('touchstart', onTouchStart, { signal });
		el.addEventListener('touchend', onTouchEnd, { signal });
		el.addEventListener('scroll', throttledHandleScroll, { signal });
	}

	function clearListeners() {
		if (abortController) {
			abortController.abort();
			abortController = null;
		}
	}

	onBeforeUnmount(() => {
		clearListeners();
	});

	return {
		translateX: readonly(translateX),
		canPrev,
		canNext,
		next,
		prev,
		goTo,
		currentIndex,
		visibleSlidesCount,
	};
}
