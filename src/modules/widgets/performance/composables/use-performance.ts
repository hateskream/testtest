import { computed, ref, watch } from 'vue';

import { type IState, getDefaultState, type Stock, type DateRange, type DisplayVariant } from '../model';
import { useGetState, useUpdateState } from '../queries';

export function usePerformance(widgetId: string) {
	const {
		data: dataState,
	} = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

	const state = ref<IState>(getDefaultState());

	const currentStock = computed({
		get: () => state.value.stock,
		set: (val: Stock) => {
			state.value.stock = val;
		},
	});

	const currentDate = computed({
		get: () => state.value.date,
		set: (val: DateRange) => {
			state.value.date = val;
		},
	});

	const currentDisplayVariant = computed({
		get: () => state.value.displayVariant,
		set: (val: DisplayVariant) => {
			state.value.displayVariant = val;
		},
	});

	const isCompactMode = computed({
		get: () => state.value.isCompactMode,
		set: (val: boolean) => {
			state.value.isCompactMode = val;
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = { ...newState };
		}

	}, { immediate: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	return {
		currentStock,
		currentDate,
		currentDisplayVariant,
		isCompactMode,

		resetAllChanges,
	};
}
