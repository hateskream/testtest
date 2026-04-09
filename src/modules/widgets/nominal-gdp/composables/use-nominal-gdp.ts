import { ref, watch } from 'vue';

import { clone } from '@/shared/lib';
import { createStateQueries } from '@/shared/service/data-repo';
import { getDefaultState, type IState, stateSchema, type StateSchemaType } from '../model';
import { useNominalGdpState } from './use-nominal-gdp-state';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useNominalGdp({
	widgetId,
	isEphemeral,
}: IOptions) {
	const state = ref<IState>(getDefaultState());

	const {
		activeRange,
		data,
		growthYoy,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		resetAllFilters,
	} = useNominalGdpState({ state });

	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__NOMINAL_DGP__',
		isSaveChange: !isEphemeral,
		getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '/api/v1/gdp/settings',
		urlSet: '/api/v1/gdp/settings',
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
		activeRange,
		data,
		growthYoy,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		applyStateToParent,
		resetAllFilters,
	};
}
