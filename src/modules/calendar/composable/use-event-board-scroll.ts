import { computed, type MaybeRefOrGetter, nextTick, onMounted, toValue, watch } from 'vue';

import { type DateYYYYMMDD, type IEventBoardResponse, toUtcIsoDate } from '@/modules/calendar';

export interface IEventBoardExposed {
	scrollToDate: (date: DateYYYYMMDD, options?: ScrollIntoViewOptions) => void;
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

	async function update(date: Date) {
		await nextTick();

		const iso = toUtcIsoDate(date);

		ref.value?.scrollToDate?.(iso, {
			behavior: 'auto',
		});
	}

	watch([() => eventBoard.value.length, baseDate], async ([_, date]) => {
		await update(date);
	}, { immediate: true, deep: true });

	onMounted(async () => {
		await update(baseDate.value);
	});
}
