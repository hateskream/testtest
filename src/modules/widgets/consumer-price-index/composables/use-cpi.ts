import { computed, ref, watch } from 'vue';

import { clone } from '@/shared/lib';
import { createStateQueries } from '@/shared/service/data-repo';
import { CpiMetric, CpiRange, getDefaultState, type IState, stateSchema, type StateSchemaType } from '../model';
import { useQueryCpi } from '../queries';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useCpi({
	widgetId,
	isEphemeral,
}: IOptions) {
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

	const state = ref<IState>(getDefaultState());

	const activeMetric = computed({
		get: () => state.value.metric,
		set: (val: CpiMetric) => {
			state.value.metric = val;
		},
	});

	const activeRange = computed({
		get: () => state.value.range,
		set: (val: CpiRange) => {
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

		activeMetric.value = defaultState.metric;
		activeRange.value = defaultState.range;
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryCpi(activeMetric, activeRange);

	return {
		activeMetric,
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
