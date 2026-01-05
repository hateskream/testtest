import { computed, type MaybeRefOrGetter, nextTick, toValue, watch } from 'vue';

import { type DateYYYYMMDD, type IEventBoardResponse, toUtcIsoDate } from '@/modules/calendar';

export interface IEventBoardExposed {
	scrollToDate: (date: DateYYYYMMDD, options?: ScrollIntoViewOptions) => void;
	scrollBy: (x: number) => void;
	calcMaxCountRowVisible: (height: number) => number;
	snapHeightToNearestStep: (height: number) => number;
}

export interface IUseEventBoardScroll {
	board: MaybeRefOrGetter<IEventBoardResponse[]>;
	baseDate: MaybeRefOrGetter<Date>;
	ref: MaybeRefOrGetter<IEventBoardExposed | null>;
}

export function useEventBoardScroll(options: IUseEventBoardScroll) {
	const eventBoard = computed(() => {
		return toValue(options.board);
	});
	const baseDate = computed(() => {
		return toValue(options.baseDate);
	});
	const ref = computed(() => {
		return toValue(options.ref);
	});

	watch([ref, baseDate, () => eventBoard.value.length], async ([element, date]) => {
		await nextTick();

		if (!element) {
			return;
		}

		const iso = toUtcIsoDate(date);

		element.scrollToDate(iso, {
			behavior: 'auto',
		});
	}, { immediate: true, deep: true });
}
