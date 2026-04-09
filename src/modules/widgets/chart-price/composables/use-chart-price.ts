import { ref, watch } from 'vue';
import { z } from 'zod';

import { createStateQueries } from '@/shared/service/data-repo';
import { deepCompare } from '@/shared/lib/compare';
import { DateRangeValueSchema } from '@/modules/charts/common/model';
import { useChartPriceState } from './use-chart-price-state';
import { getDefaultsState, type IState } from '../model';

export const stateSchema = z.object({
	selectedTicker: z.string(),
	timeRange: DateRangeValueSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;
export type StateSchemaInputType = z.input<typeof stateSchema>;

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType: string;
}

export function useChartPrice({
	widgetId,
	isEphemeral,
	defaultStateType,
}: IOptions) {
	const state = ref<IState>(getDefaultsState(defaultStateType));

	const {
		selectedTickerId,
		selectedTickersModel,
		timeRange,
		watchlists,

		data,
		isLoading,
		isError,
		refetch,

		handleAddToWatchlist,
		handleRemoveFromWatchlist,
		handleAddTickerInNewWatchlist,
		handleToggleFavoriteWatchlist,
		resetAllChanges,
	} = useChartPriceState({ state, defaultStateType });

	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType, StateSchemaInputType>({
		isEphemeral,
		storageKey: '__CHART_PRICE__',
		isSaveChange: !isEphemeral,
		getDefaultState: () => getDefaultsState(defaultStateType),
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

	watch(() => state.value, (newState, oldState) => {
		if (deepCompare(newState, oldState)) {
			return;
		}

		mutate(newState);
	}, { deep: true });

	return {
		selectedTickerId,
		selectedTickersModel,
		timeRange,
		state,
		watchlists,

		data,
		isLoading,
		isError,
		refetch,

		handleAddToWatchlist,
		handleRemoveFromWatchlist,
		handleAddTickerInNewWatchlist,
		handleToggleFavoriteWatchlist,
		resetAllChanges,
		applyStateToParent,
	};
}
