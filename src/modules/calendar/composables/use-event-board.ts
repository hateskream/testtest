import { type Ref, type WatchSource, computed, nextTick, onMounted, toValue, watch } from 'vue';
import { useThrottleFn } from '@vueuse/core';

const SCROLL_THRESHOLD = 100;

interface IGroupedDay {
	date: string;
	grouped: { hour: string; missed: boolean }[];
}

interface IUseEventBoardOptions {
	container: Ref<HTMLElement | null> | (() => HTMLElement | null);
	groupedBoard: WatchSource<IGroupedDay[]>;
	isFetchingPrev: WatchSource<boolean>;
	isFetchingNext: WatchSource<boolean>;
	getSectionElement: (container: HTMLElement, date: string, hour: string) => Element | null;
	onLoadPrev: () => void;
	onLoadNext: () => void;
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
		if (isFetchingPrev.value || isFetchingNext.value) {
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
						section.scrollIntoView({ block: 'start' });
						return;
					}
				}
			}
		}

		element.scrollTop = element.scrollHeight;
		onLoadNext();
	}

	onMounted(() => {
		scrollToNextEvent();
	});

	const handleScrollThrottled = useThrottleFn(handleScroll, 50);

	return {
		handleScroll: handleScrollThrottled,
	};
}
