import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import {
	getDefaultsState,
	TimeRangeFilterValue,
	type IState,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';
import { useWatchlist } from '@/modules/watchlist';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

export const stateSchema = z.object({
	selectedTicker: z.string(),
	timeRange: z.nativeEnum(TimeRangeFilterValue),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

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
	const {
		actionableWatchlists: wachlists,
		addToWatchlist,
		removeFromWatchlist,
		addTickerInNewWatchlist,
	} = useWatchlist();

	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
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

	const state = ref<IState>(getDefaultsState(defaultStateType));

	const selectedTicker = computed({
		get: () => state.value.selectedTicker,
		set: (val: string) => {
			state.value.selectedTicker = val;
		},
	});

	const timeRange = computed({
		get: () => state.value.timeRange,
		set: (val: TimeRangeFilterValue) => {
			state.value.timeRange = val;
		},
	});

	const {
		data: dataState,
	} = useStateQuery();
	const { mutate } = useStateMutation();

	watch(dataState, newState => {
		if (newState) {
			state.value = {
				...newState,
			};
		}
	}, { immediate: true });

	watch(() => state.value, newState => {
		mutate(newState);
	}, { deep: true });

	function resetAllChanges() {
		state.value = getDefaultsState(defaultStateType);
	}

	function handleAddToWatchlist(watchlistId: string ) {
		const marketType = resolveMarketTypeFromTicker(selectedTicker.value);
		if (!marketType) {
			return;
		}

		addToWatchlist(watchlistId, selectedTicker.value, marketType);
	}

	function handleRemoveFromWatchlist(watchlistId: string) {
		removeFromWatchlist(watchlistId, selectedTicker.value);
	}

	function handleAddTickerInNewWatchlist() {
		const marketType = resolveMarketTypeFromTicker(selectedTicker.value);
		if (!marketType) {
			return;
		}

		addTickerInNewWatchlist(selectedTicker.value, marketType);
	}

	return {
		selectedTicker,
		timeRange,
		state,
		wachlists,

		handleAddToWatchlist,
		handleRemoveFromWatchlist,
		handleAddTickerInNewWatchlist,
		resetAllChanges,
		applyStateToParent,
	};
}
