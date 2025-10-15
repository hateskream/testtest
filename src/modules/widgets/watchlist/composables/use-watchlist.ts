import { computed, ref, watch } from 'vue';
import { z } from 'zod';

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
	hydrateState,
	rehydrateState,
	selectNewActiveTableId,
	updateSort,
	updateTableState,
} from '../model';
import type { ISort, ITableColumn } from '@/modules/cell';
import { useWatchlist } from '@/modules/watchlist';
import type { MarketType } from '@/modules/market';
import { createStateQueries } from '@/shared/service/data-repo';
import { ColumnType, SortDirection } from '@/modules/cell';

const sortSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	sortDirection: z.nativeEnum(SortDirection),
});

const tickerStateSchema = z.object({
	isShowLogo: z.boolean(),
	isShowTicker: z.boolean(),
	isShowDescription: z.boolean(),
});

const columnSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	isShow: z.boolean(),
	order: z.number(),
});

const sectionSchema = z.object({
	id: z.string(),
	isOpen: z.boolean(),
});

const tableSchema = z.object({
	id: z.string(),
	columns: z.array(columnSchema),
	sections: z.array(sectionSchema),
	tickerState: tickerStateSchema,
	sort: sortSchema.nullable(),
});

export const stateSchema = z.object({
	activeTableId: z.string().nullable(),
	tables: z.array(tableSchema),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType: string;
}

export function useWatchlistWidget({ widgetId, isEphemeral }: IOptions) {
	const {
		watchlists,
		selectedTickers,

		addNewWatchlist,
		renameWatchlist,
		removeWatchlist,
		duplicateWatchlist,

		deleteSectionFromWatchlist,

		addToWatchlist,
		removeFromWatchlist,
	} = useWatchlist();

	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__WATCHLIST_WIDGET__',
		isSaveChange: !isEphemeral,
		getDefaultState: () => getDefaultState(watchlists.value),
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: hydrateState,
		rehydrateFn: rehydrateState,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState(watchlists.value));

	const table = ref<ITable | null>(null);
	const tabs = computed((): ITab[] =>
		getTabsFromWatchlists(watchlists.value, state.value.activeTableId),
	);

	const sections = computed((): ISectionUi[] => getSections(state.value, watchlists.value));

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

	function handlerRemoveSectionFromWatchlist(sectionId: string) {
		if (!table.value) {
			return;
		}

		deleteSectionFromWatchlist(table.value.id, sectionId);
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
		selectedTickers,

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

		handlerRemoveSectionFromWatchlist,

		applyStateToParent,
	};
}
