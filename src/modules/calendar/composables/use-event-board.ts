import { computed, nextTick, onMounted, onScopeDispose, type Ref, toValue, watch, type WatchSource } from 'vue';
import { useThrottleFn } from '@vueuse/core';

const SCROLL_THRESHOLD = 100;
const HEADER_HEIGHT = 36;

interface IGroupedDay {
	date: string;
	grouped: { hour: string; missed: boolean }[];
}

interface IUseEventBoardOptions {
	container: Ref<HTMLElement | null> | (() => HTMLElement | null);
	groupedBoard: WatchSource<IGroupedDay[]>;
	isFetchingPrev: WatchSource<boolean>;
	isFetchingNext: WatchSource<boolean>;
	getSectionElement: (container: HTMLElement, date: string, hour: string) => HTMLElement | null;
	onLoadPrev: () => void;
	onLoadNext: () => void;
	scrollToDate?: WatchSource<string | undefined>;
	scrollToHour?: WatchSource<string | undefined>;
}

export function useEventBoard(options: IUseEventBoardOptions) {
	const {
		getSectionElement,
		onLoadPrev,
		onLoadNext,
	} = options;

	let prevScrollHeight = 0;

	const container = computed(
		() => toValue(options.container),
	);

	let isScrollingProgrammatically = false;
	let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
	let currentCleanup: (() => void) | null = null;

	function scrollToElement(element: HTMLElement, top: number) {
		currentCleanup?.();

		isScrollingProgrammatically = true;

		element.scrollTo({
			top,
			behavior: 'smooth',
		});

		const cleanup = () => {
			isScrollingProgrammatically = false;
			if (scrollEndTimeout) {
				clearTimeout(scrollEndTimeout);
				scrollEndTimeout = null;
			}

			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			element.removeEventListener('scrollend', onScrollEnd);
			currentCleanup = null;
		};

		const onScrollEnd = () => cleanup();

		// scrollend не работает в некоторых браузерах, fallback для них через timeout
		scrollEndTimeout = setTimeout(cleanup, 1000);
		element.addEventListener('scrollend', onScrollEnd, { once: true });
		currentCleanup = cleanup;
	}

	onScopeDispose(() => {
		currentCleanup?.();
	});

	const isFetchingPrev = computed(() => toValue(options.isFetchingPrev));
	const isFetchingNext = computed(() => toValue(options.isFetchingNext));

	watch(options.isFetchingPrev, async (isFetching, wasFetching) => {
		const element = container.value;

		if (!element) {
			return;
		}

		if (isFetching && !wasFetching) {
			prevScrollHeight = element.scrollHeight;
		}

		if (!isFetching && wasFetching) {
			await nextTick();

			const heightDiff = element.scrollHeight - prevScrollHeight;
			element.scrollTop += heightDiff;
		}
	});

	function handleScroll() {
		if (isScrollingProgrammatically || isFetchingPrev.value || isFetchingNext.value ) {
			return;
		}

		const element = container.value;

		if (!element) {
			return;
		}

		const isScrollTopThreshold = element.scrollTop <= SCROLL_THRESHOLD;
		if (isScrollTopThreshold) {
			onLoadPrev();
		}

		const isScrollBottomThreshold =
			element.scrollHeight - element.scrollTop - element.clientHeight <= SCROLL_THRESHOLD;

		if (isScrollBottomThreshold) {
			onLoadNext();
		}
	}

	function scrollToNextEvent() {
		const element = container.value;

		if (!element) {
			return;
		}

		const board = toValue(options.groupedBoard);

		for (const day of board) {
			for (const group of day.grouped) {
				if (!group.missed) {
					const section = getSectionElement(element, day.date, group.hour);
					if (section) {
						const containerRect = element.getBoundingClientRect();
						const sectionRect = section.getBoundingClientRect();
						const offset = sectionRect.top - containerRect.top + element.scrollTop - HEADER_HEIGHT;

						scrollToElement(element, offset);

						return;
					}
				}
			}
		}

		element.scrollTop = element.scrollHeight;
		onLoadNext();
	}

	function scrollToTarget() {
		const element = container.value;
		if (!element) {
			return;
		}

		const targetDate = options.scrollToDate ? toValue(options.scrollToDate) : undefined;
		const targetHour = options.scrollToHour ? toValue(options.scrollToHour) : undefined;

		if (targetDate && targetHour) {
			const section = getSectionElement(element, targetDate, targetHour);
			if (section) {
				const containerRect = element.getBoundingClientRect();
				const sectionRect = section.getBoundingClientRect();
				const offset = sectionRect.top - containerRect.top + element.scrollTop - HEADER_HEIGHT;

				scrollToElement(element, offset);
				return;
			}
		}

		scrollToNextEvent();
	}

	onMounted(() => {
		scrollToTarget();
	});

	const handleScrollThrottled = useThrottleFn(handleScroll, 50);

	return {
		handleScroll: handleScrollThrottled,
	};
}
