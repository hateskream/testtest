import { computed, type Ref } from 'vue';

import { getDefaultState, type IState, type RealGdpDateRangePresetType } from '../model';
import { useQueryRealGdp } from '../queries';

interface IOptions {
	state: Ref<IState>;
}

export function useRealGdpState({ state }: IOptions) {
	const activeRange = computed({
		get: () => state.value.range,
		set: (val: RealGdpDateRangePresetType) => {
			state.value.range = val;
		},
	});

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	function resetAllFilters() {
		const defaultState = getDefaultState();

		activeRange.value = defaultState.range;
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryRealGdp(activeRange);

	return {
		activeRange,
		data,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		resetAllFilters,
	};
}
