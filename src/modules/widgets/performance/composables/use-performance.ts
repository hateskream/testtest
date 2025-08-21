import { computed, ref } from 'vue';

import { type IState, getDefaultState, type Stock, type DateRange, type DisplayVariant } from '../model';

export function usePerformance() {
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
