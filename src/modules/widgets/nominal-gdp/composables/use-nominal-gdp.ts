import { computed, ref, watch } from 'vue';

import { clone } from '@/shared/lib';
import { createStateQueries } from '@/shared/service/data-repo';
import {
	calculateGrowthYoy,
	getDefaultState,
	type IState,
	type NominalGdpDateRangePresetType,
	stateSchema,
	type StateSchemaType,
} from '../model';
import { useQueryNominalGdp } from '../queries';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useNominalGdp({
	widgetId,
	isEphemeral,
}: IOptions) {
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

	const state = ref<IState>(getDefaultState());

	const activeRange = computed({
		get: () => state.value.range,
		set: (val: NominalGdpDateRangePresetType) => {
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
		history,
		refetch,
		resetAllChanges,
		applyStateToParent,
		resetAllFilters,
	};
}
