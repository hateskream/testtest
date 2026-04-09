import { computed, type Ref } from 'vue';

import { type CpiDateRangePresetType, type CpiValueTypeType, getDefaultState, type IState } from '../model';
import { useQueryCpi } from '../queries';

interface IOptions {
	state: Ref<IState>;
}

export function useCpiState({ state }: IOptions) {
	const activeValueType = computed({
		get: () => state.value.valueType,
		set: (val: CpiValueTypeType) => {
			state.value.valueType = val;
		},
	});

	const activeRange = computed({
		get: () => state.value.range,
		set: (val: CpiDateRangePresetType) => {
			state.value.range = val;
		},
	});

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	function resetAllFilters() {
		const defaultState = getDefaultState();

		activeValueType.value = defaultState.valueType;
		activeRange.value = defaultState.range;
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryCpi(activeRange);

	return {
		activeValueType,
		activeRange,
		data,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		resetAllFilters,
	};
}
