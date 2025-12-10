import { computed, ref, watch } from 'vue';

import { createStateQueries } from '@/shared/service/data-repo';
import {
	DominanceDateRange,
	getDefaultState,
	type IDisplaySettings,
	type IState,
	stateSchema,
	type StateSchemaType,
} from '../model';
import { useQueryDominanceSnapshot } from '../queries';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useDominance({
	widgetId,
	isEphemeral,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__DOMINANCE__',
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

	const selectedTickers = computed({
		get: () => state.value.selectedTickers,
		set: (val: string[]) => {
			state.value.selectedTickers = val;
		},
	});

	const activeDateRange = computed({
		get: () => state.value.dateRange,
		set: (val: DominanceDateRange) => {
			state.value.dateRange = val;
		},
	});

	const displaySettings = computed({
		get: () => state.value.displaySettings,
		set: (val: IDisplaySettings) => {
			state.value.displaySettings = val;
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
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
	} = useQueryDominanceSnapshot(selectedTickers);

	return {
		selectedTickers,
		activeDateRange,
		displaySettings,
		data,
		isError,
		isLoading,
		history,
		refetch,
		resetAllChanges,
		applyStateToParent,
	};
}
