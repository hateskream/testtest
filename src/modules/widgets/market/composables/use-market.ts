import { computed, ref, watch } from 'vue';

import {
	getDefaultSettings,
	getDefaultState,
	type FiltersState,
	type FiltersValues,
	type ISettings,
	type IState,
	type IWatchlistAction,
} from '../model';
import type { MarketType } from '@/modules/market';
import { useGetState, useUpdateState } from '../queries';
import type { ITableColumn, ISort } from '@/modules/cell';
import { Producer } from '@/shared/service/event-bus';
import { useWatchlistPublic } from '../../watchlist';

type Event = 'addToWatchlist' | 'removeFromWatchlist';

interface IPayload {
	tickerId: string;
	tickerType: MarketType;
	watchlistId: string;
	tabId: string;
}

type Events = Record<Event, IPayload>;

export function useMarket(widgetId: string) {
	const { wachlists } = useWatchlistPublic();

	const producer = new Producer<Events>(['addToWatchlist', 'removeFromWatchlist']);

	const { data: dataState } = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

	const state = ref<IState>(getDefaultState());

	const currentSettings = ref<ISettings>(getDefaultSettings());

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: MarketType) => {
			state.value.activeMarket = val;
		},
	});

	const columns = computed({
		get: () => currentSettings.value.column,
		set: (val: ITableColumn[]) => {
			currentSettings.value.column = val;
		},
	});

	const activeSort = computed({
		get: () => currentSettings.value.sort,
		set: (sort: ISort | null) => {
			currentSettings.value.sort = sort;
		},
	});

	const filtersValues = computed((): FiltersValues =>
		Object
			.entries(currentSettings.value.filters)
			.reduce((acc, [key, value]) => ({
				...acc,
				[key]: value.values,
			})
			, {}),
	);

	const filtersState = computed({
		get(): FiltersState {
			return Object.entries(currentSettings.value.filters).reduce(
				(acc, [filter, filterState]) => ({
					...acc,
					[filter]: filterState.state,
				}),
				{},
			);
		},
		set(updatedState: FiltersState) {
			currentSettings.value.filters = Object
				.entries(currentSettings.value.filters)
				.reduce(
					(acc, [filter, filterState]) => ({
						...acc,
						[filter]: {
							...filterState,
							state: updatedState[filter],
						},
					}),
					{},
				);
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
			currentSettings.value = state.value.settings[state.value.activeMarket];
		}
	}, { immediate: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	watch(
		() => state.value.activeMarket,
		newMarket => {
			currentSettings.value = state.value.settings[newMarket];
		},
	), { immediate: true };

	watch(
		currentSettings,
		newSettings => {
			state.value.settings[state.value.activeMarket] = newSettings;
		},
	);

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	function addToWatchlist({ watchlistId, tabId, tickerId }: IWatchlistAction) {
		producer.emit('addToWatchlist', {
			tickerId,
			watchlistId,
			tabId,
			tickerType: activeMarket.value,
		});
	}

	function removeFromWatchlist({ watchlistId, tabId, tickerId }: IWatchlistAction) {
		producer.emit('removeFromWatchlist', {
			tickerId,
			watchlistId,
			tabId,
			tickerType: activeMarket.value,
		});
	}

	return {
		columns,
		activeMarket,
		activeSort,
		filtersValues,
		filtersState,

		wachlists,

		resetAllChanges,

		addToWatchlist,
		removeFromWatchlist,
	};
}
