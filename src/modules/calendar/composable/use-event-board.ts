import { computed, type MaybeRefOrGetter, ref, toValue, watch } from 'vue';

import type { ICreateEventBoardOptions, IEventBoard } from '../types';
import { useEventBoardGetState, useEventBoardUpdateState } from '../query';

export function useEventBoard(optionsGetter: MaybeRefOrGetter<ICreateEventBoardOptions>) {
	const eventBoard = ref<IEventBoard[]>([]);

	const options = computed(() => toValue(optionsGetter));

	const { data: eventBoardData } = useEventBoardGetState(options.value);
	const { mutate } = useEventBoardUpdateState();

	watch(eventBoardData, newState => {
		if (newState) {
			eventBoard.value = [...newState];
		}
	}, { immediate: true });

	watch(options, newState => {
		mutate(newState);
	}, { deep: true });

	return {
		eventBoard,
		options,
	};
}
