import { computed, ref, watch } from 'vue';

import {
	type ISectionUi,
	type IState,
	type ITab,
	type ITable,
	type ITickerAddPayload,
	type ITickerRemovePayload,
	type ITickersAddPayload,
	changeActiveTable,
	changeColumnsState,
	createTablesFromWatchlists,
	findTable,
	getDefaultState,
	getSections,
	getTabsFromWatchlists,
	selectNewActiveTableId,
	updateSort,
	updateTableState,
} from '../model';
import type { ISort, ITableColumn } from '@/modules/cell';
import { useGetState, useUpdateState } from '../queries';
import { useWatchlist } from '@/modules/watchlist';
import type { MarketType } from '@/modules/market';

export function useWatchlistWidget(widgetId: string) {
	const {
		watchlists,

		addNewWatchlist,
		renameWatchlist,
		removeWatchlist,
		duplicateWatchlist,

		addToWatchlist,
		removeFromWatchlist,
	} = useWatchlist();

	const { data: dataState } = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

	const state = ref<IState>(getDefaultState(watchlists.value));

	const table = ref<ITable | null>(null);
	const tabs = computed((): ITab[] =>
		getTabsFromWatchlists(watchlists.value, state.value.activeTableId),
	);

	const sections = computed((): ISectionUi[] => getSections(state.value, watchlists.value));

	const tickerIds = computed(() => []);

	const columns = computed({
		get: () => table.value?.columns || [],
		set: (cols: ITableColumn[]) => {
			state.value = updateTableState(
				state.value,
				t => changeColumnsState(t, cols),
			);
		},
	});

	const activeSort = computed({
		get: () => table.value?.sort ?? null,
		set: (sort: ISort | null) => {
			state.value = updateTableState(
				state.value,
				t => updateSort(t, sort),
			);
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
			setTable(state.value, state.value.activeTableId);
		}
	});

	watch(
		() => state.value.activeTableId,
		newActiveTableId => {
			setTable(state.value, newActiveTableId);
		},
		{ immediate: true },
	);

	watch(() => [...watchlists.value],
		(newWatchlists, oldWatchlists) => {
			state.value = {
				activeTableId: selectNewActiveTableId(newWatchlists, oldWatchlists, state.value.activeTableId),
				tables: createTablesFromWatchlists(newWatchlists, state.value.tables),
			};
		},
	), { immediate: true, deep: true };

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	function setTable(newState: IState, newActiveTableId: string | null) {
		if (newActiveTableId === null) {
			table.value = null;
			return;
		}

		table.value = findTable(newState, newActiveTableId);
	}

	function handlerSwitchTab(tabId: string) {
		state.value = changeActiveTable(state.value, tabId);
	}

	function handlerAddToWatchlist({ tickerId, tickerType }: ITickerAddPayload) {
		if (!table.value) {
			return;
		}

		addToWatchlist(table.value.id, tickerId, tickerType);
	}

	function handlerAddTickersToWatchlist({ tickers }: ITickersAddPayload) {
		Object.entries(tickers)
			.forEach(([tickerType, _tickerIds]) => {
				_tickerIds.forEach(tickerId => {
					handlerAddToWatchlist({ tickerId, tickerType: tickerType as MarketType });
				});
			});
	}

	function handlerRemoveFromWatchlist({ tickerId }: ITickerRemovePayload) {
		if (!table.value) {
			return;
		}

		removeFromWatchlist(table.value.id, tickerId);
	}

	function resetAllChanges() {
		state.value = getDefaultState(watchlists.value);
	}

	function createNewWatchlist() {
		addNewWatchlist();
	}

	return {
		tabs,
		columns,
		activeSort,
		sections,
		tickerIds,

		addNewWatchlist,
		renameWatchlist,
		removeWatchlist,
		duplicateWatchlist,

		handlerSwitchTab,

		resetAllChanges,

		handlerAddToWatchlist,
		handlerRemoveFromWatchlist,
		handlerAddTickersToWatchlist,

		createNewWatchlist,
	};
}
