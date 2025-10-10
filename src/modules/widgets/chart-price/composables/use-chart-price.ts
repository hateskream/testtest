import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import {
	getDefaultsState,
	TimeRangeFilterValue,
	type IState,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

export const stateSchema = z.object({
	selectedTicker: z.string(),
	timeRange: z.nativeEnum(TimeRangeFilterValue),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function useChartPrice(widgetId: string, defaultStateType: string) {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IState, StateSchemaType>({
		storageKey: '__CHART_PRICE__',
		isSaveChange: true,
		getDefaultState: () => getDefaultsState(defaultStateType),
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const state = ref<IState>(getDefaultsState(defaultStateType));

	const selectedTicker = computed({
		get: () => state.value.selectedTicker,
		set: (val: string) => {
			state.value.selectedTicker = val;
		},
	});

	const timeRange = computed({
		get: () => state.value.timeRange,
		set: (val: TimeRangeFilterValue) => {
			state.value.timeRange = val;
		},
	});

	const {
		data: dataState,
	} = useStateQuery();
	const { mutate } = useStateMutation();

	watch(dataState, newState => {
		if (newState) {
			state.value = {
				...state.value,
				...newState,
			};
		}
	}, { immediate: true });

	watch(state, (newState, oldState) => {
		if (JSON.stringify(newState) === JSON.stringify(oldState)) {
			return;
		}
		mutate(newState);
	}, { deep: true });

	function resetAllChanges() {
		state.value = getDefaultsState(defaultStateType);
	}

	return {
		selectedTicker,
		timeRange,
		resetAllChanges,
		state,
	};
}
