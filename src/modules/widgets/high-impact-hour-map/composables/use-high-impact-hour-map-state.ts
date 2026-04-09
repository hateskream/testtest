import { computed, type Ref } from 'vue';

import type { TimezoneUtcType } from '@/modules/charts/common/model';
import { getDefaultState, type IState, mapHighImpactHourMap } from '../model';
import { useQueryHighImpactHourMap } from '../queries';

interface IOptions {
	widgetId: string;
	state: Ref<IState>;
}

export function useHighImpactHourMapState({ widgetId, state }: IOptions) {
	const activeTimezone = computed({
		get: () => state.value.timezone,
		set: (val: TimezoneUtcType) => {
			state.value.timezone = val;
		},
	});

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryHighImpactHourMap(widgetId, activeTimezone);

	const preparedData = computed(() => {
		if (data.value) {
			return mapHighImpactHourMap(data.value);
		}

		return undefined;
	});

	return {
		activeTimezone,
		data: preparedData,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
	};
}
