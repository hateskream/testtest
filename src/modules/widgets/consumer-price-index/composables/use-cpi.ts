import { ref, watch } from 'vue';

import { clone } from '@/shared/lib';
import { createStateQueries } from '@/shared/service/data-repo';
import { getDefaultState, type IState, stateSchema, type StateSchemaType } from '../model';
import { useCpiState } from './use-cpi-state';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useCpi({
	widgetId,
	isEphemeral,
}: IOptions) {
	const state = ref<IState>(getDefaultState());

	const {
		activeValueType,
		activeRange,
		data,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		resetAllFilters,
	} = useCpiState({ state });

	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__CPI__',
		isSaveChange: !isEphemeral,
		getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '/api/v1/cpi/settings',
		urlSet: '/api/v1/cpi/settings',
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
		activeValueType,
		activeRange,
		data,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		applyStateToParent,
		resetAllFilters,
	};
}
