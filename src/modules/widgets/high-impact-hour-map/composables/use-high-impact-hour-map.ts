import { ref, watch } from 'vue';

import { clone } from '@/shared/lib';
import { createStateQueries } from '@/shared/service/data-repo';
import { getDefaultState, type IState, stateSchema, type StateSchemaType } from '../model';
import { useHighImpactHourMapState } from './use-high-impact-hour-map-state';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useHighImpactHourMap({
	widgetId,
	isEphemeral,
}: IOptions) {
	const state = ref<IState>(getDefaultState());

	const {
		activeTimezone,
		data: preparedData,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
	} = useHighImpactHourMapState({ state, widgetId });

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

	watch(dataState, newState => {
		if (newState) {
			state.value = clone(newState);
		}
	}, { immediate: true });

	watch(state, (newState) => {
		mutate(newState);
	}, { deep: true });

	return {
		activeTimezone,
		data: preparedData,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		applyStateToParent,
	};
}
