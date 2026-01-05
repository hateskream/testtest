import { computed, type MaybeRefOrGetter } from 'vue';

import type { IEventBoardRequestOptions } from '../models';
import { useEventBoardGetState } from '../query';

export function useEventBoard(options: MaybeRefOrGetter<IEventBoardRequestOptions>) {
	const rest = useEventBoardGetState(options);

	const eventBoard = computed(() => {
		return rest.data.value ?? [];
	});

	return {
		eventBoard,
		...rest,
	};
}
