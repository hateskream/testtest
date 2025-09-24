import { computed, type MaybeRefOrGetter, ref, toValue, watch } from 'vue';

import type { IEventBoardRequestOptions, IEventBoardResponse } from '../models';
import { useEventBoardGetState, useEventBoardUpdateState } from '../query';

export function useEventBoard(optionsGetter: MaybeRefOrGetter<IEventBoardRequestOptions>) {
	const eventBoard = ref<IEventBoardResponse[]>([]);

	const options = computed(() => toValue(optionsGetter));

	const { data: eventBoardData, isError, isLoading } = useEventBoardGetState(options.value);
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
		isError,
		isLoading,
	};
}
