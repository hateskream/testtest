import { ref, watch } from 'vue';

import { createStateQueries } from '@/shared/service/data-repo';
import { deepCompare } from '@/shared/lib/compare.ts';
import { getDefaultState, type IState, stateSchema, type StateSchemaInputType, type StateSchemaType } from '../model';
import { useMarketCapState } from './use-market-cap-state';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
}

export function useMarketCap({
	widgetId,
	isEphemeral,
}: IOptions) {
	const state = ref<IState>(getDefaultState());

	const {
		selectedTickers,
		selectedMarkets,
		activeDateRange,
		displaySettings,
		data,
		isError,
		isLoading,
		refetch,
		resetAllChanges,
	} = useMarketCapState({ state });

	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType, StateSchemaInputType>({
		isEphemeral,
		storageKey: '__MARKET_CAP__',
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

	watch(dataState, (newState, oldState) => {
		if (!newState) {
			return;
		}

		if (deepCompare(newState, oldState)) {
			return;
		}

		state.value = JSON.parse(JSON.stringify(newState));
	}, { immediate: true });

	watch(state, (newState, oldState) => {
		if (deepCompare(newState, oldState)) {
			return;
		}

		mutate(newState);
	}, { deep: true });

	return {
		selectedTickers,
		selectedMarkets,
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
