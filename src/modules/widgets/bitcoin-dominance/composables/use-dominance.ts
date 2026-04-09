import { ref, watch } from 'vue';

import { createStateQueries } from '@/shared/service/data-repo';
import { deepCompare } from '@/shared/lib/compare';
import { getDefaultState, type IState, stateSchema, type StateSchemaType } from '../model';
import { useDominanceState } from './use-dominance-state';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useDominance({
	widgetId,
	isEphemeral,
}: IOptions) {
	const state = ref<IState>(getDefaultState());

	const {
		selectedTickers,
		activeDateRange,
		displaySettings,
		data,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
	} = useDominanceState({ state });

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

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
		}
	}, { immediate: true });

	watch(state, (newState) => {
		if (deepCompare(newState, state.value)) {
			return;
		}

		mutate(newState);
	}, { deep: true });

	return {
		selectedTickers,
		activeDateRange,
		displaySettings,
		data,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
		applyStateToParent,
	};
}
