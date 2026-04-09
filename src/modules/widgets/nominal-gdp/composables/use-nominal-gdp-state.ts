import { computed, type Ref } from 'vue';

import { calculateGrowthYoy, getDefaultState, type IState, type NominalGdpDateRangePresetType } from '../model';
import { useQueryNominalGdp } from '../queries';

interface IOptions {
	state: Ref<IState>;
}

export function useNominalGdpState({ state }: IOptions) {
	const activeRange = computed({
		get: () => state.value.range,
		set: (val: NominalGdpDateRangePresetType) => {
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
	} = useQueryNominalGdp(activeRange);

	const growthYoy = computed(() => {
		if (!data.value) {
			return null;
		}

		return calculateGrowthYoy(data.value.points);
	});

	return {
		activeRange,
		data,
		growthYoy,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		resetAllFilters,
	};
}
