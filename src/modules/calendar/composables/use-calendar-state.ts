import { computed, type Ref } from 'vue';
import { useNow } from '@vueuse/core';

import { getDefaultsState, type IState } from '../model/state';

interface IOptions {
	interval?: number;
	state: Ref<IState>;
}

export function useCalendarState({ interval = 60_000, state }: IOptions) {
	const currentTime = useNow({ interval });

	const selectedCountries = computed({
		get: () => state.value.selectedCountries ?? [],
		set(value) {
			state.value.selectedCountries = [...value];
		},
	});

	const selectedCategories = computed({
		get: () => state.value.selectedCategories ?? [],
		set(value) {
			state.value.selectedCategories = [...value];
		},
	});

	const selectedImpacts = computed({
		get: () => state.value.selectedImpacts ?? [],
		set(value) {
			state.value.selectedImpacts = [...value];
		},
	});

	function resetAll() {
		state.value = getDefaultsState();
	}

	return {
		currentTime,
		selectedCountries,
		selectedCategories,
		selectedImpacts,
		resetAll,
	};
}
