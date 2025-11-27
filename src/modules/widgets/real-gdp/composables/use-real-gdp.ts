import { computed, ref, watch } from 'vue';

import { clone } from '@/shared/lib';
import { createStateQueries } from '@/shared/service/data-repo';
import { getDefaultState, type IState, RealGdpRange, stateSchema, type StateSchemaType } from '../model';
import { useQueryRealGdp } from '../queries';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useRealGdp({
	widgetId,
	isEphemeral,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__REAL_DGP__',
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

	const state = ref<IState>(getDefaultState());

	const activeRange = computed({
		get: () => state.value.range,
		set: (val: RealGdpRange) => {
			state.value.range = val;
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
		history,
		refetch,
		resetAllChanges,
		applyStateToParent,
		resetAllFilters,
	};
}
