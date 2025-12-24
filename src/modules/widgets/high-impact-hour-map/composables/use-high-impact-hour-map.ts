import { computed, ref, watch } from 'vue';

import { clone } from '@/shared/lib';
import { createStateQueries } from '@/shared/service/data-repo';
import {
	getDefaultState,
	type IState,
	mapHighImpactHourMap,
	stateSchema,
	type StateSchemaType,
	type TimeZoneUTC,
} from '../model';
import { useQueryHighImpactHourMap } from '../queries';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useHighImpactHourMap({
	widgetId,
	isEphemeral,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__HIGH_IMPACT_HOUR_MAP__',
		isSaveChange: !isEphemeral,
		getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();

	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState());

	const activeTimezone = computed({
		get: () => state.value.timezone,
		set: (val: TimeZoneUTC) => {
			state.value.timezone = val;
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = clone(newState);
		}
	}, { immediate: true });

	watch(state, (newState) => {
		mutate(newState);
	}, { deep: true });

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
		history,
		refetch,
		resetAllChanges,
		applyStateToParent,
	};
}
