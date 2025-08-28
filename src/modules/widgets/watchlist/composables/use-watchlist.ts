import { computed, onUnmounted, ref, watch } from 'vue';
import z from 'zod';

import {
	type IState,
	type ITable,
	addCustomSection,
	addNewTab,
	addTickerInTab,
	changeActiveTab,
	changeColumnsState,
	changeSectionsVisibility,
	changeTabOrder,
	deleteSection,
	deleteTickerInTab,
	duplicateTab,
	findTab,
	getActiveTab,
	getDefaultState,
	getUiTabs,
	moveRowBetweenSections,
	moveRowInSection,
	removeTab,
	renameSection,
	renameTab,
	updateSort,
	updateTableState,
} from '../model';
import type { ISort, ITableColumn } from '@/modules/cell';
import { useGetState, useUpdateState } from '../queries';
import { Consumer } from '@/shared/service/event-bus';
import { MarketType } from '@/modules/market';

type Event = 'addToWatchlist' | 'removeFromWatchlist';

const payloadSchema = z.object({
	tickerId: z
		.string()
		.min(1, { message: 'tickerId is required and must be a non-empty string' }),
	tickerType: z.nativeEnum(
		MarketType,
		{ message: 'tickerType is required and must be a MarketType' },
	),
	watchlistId: z
		.string()
		.min(1, { message: 'watchlistId is required and must be a non-empty string' }),
	tabId: z
		.string()
		.min(1, { message: 'tabId is required and must be a non-empty string' }),
});

type IPayload = z.infer<typeof payloadSchema>;

type Events = Record<Event, IPayload>;

export function useWatchlist(widgetId: string) {
	const consumer = new Consumer<Events>(['addToWatchlist', 'removeFromWatchlist']);

	consumer.on('addToWatchlist', addToWatchlist);
	consumer.on('removeFromWatchlist', removeFromWatchlist);

	const { data: dataState } = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

	const state = ref<IState>(getDefaultState());

	const table = ref<ITable | null>(null);
	const tabs = computed(() => getUiTabs(state.value));
	const sections = computed(() => table.value?.sections || []);

	const activeTab = computed(() => getActiveTab(state.value));

	const tickerIds = computed(() =>
		table.value?.sections
			.reduce((acc, section) =>
				[
					...acc,
					...section.rows
						.map(row => row.id),
				], [] as string[],
			) || [],
	);

	const columns = computed({
		get: () => table.value?.columns || [],
		set: (cols: ITableColumn[]) => {
			state.value = updateTableState(
				state.value,
				table.value,
				activeTab.value,
				t => changeColumnsState(t, cols),
			);
		},
	});

	const activeSort = computed({
		get: () => table.value?.sort ?? null,
		set: (sort: ISort | null) => {
			state.value = updateTableState(
				state.value,
				table.value,
				activeTab.value,
				t => updateSort(t, sort),
			);
		},
	});

	onUnmounted(() => {
		consumer.off('addToWatchlist', addToWatchlist);
		consumer.off('removeFromWatchlist', removeFromWatchlist);
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
			setTable(state.value, state.value.activeTabId);
		}
	}, { immediate: true });

	watch(
		() => state.value.activeTabId,
		newActiveTabId => {
			setTable(state.value, newActiveTabId);
		},
		{ immediate: true },
	);

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	function setTable(newState: IState, newActiveTabId: string | null) {
		if (newActiveTabId === null) {
			return;
		}

		const foundedTab = findTab(newState, newActiveTabId);
		if (foundedTab === undefined) {
			return;
		}

		table.value = foundedTab.table;
	}

	function handlerAddNewTab() {
		state.value = addNewTab(state.value, 'New tab');
	}

	function handlerRenameTab(tabId: string, newName: string) {
		state.value = renameTab(state.value, tabId, newName);
	}

	function handlerChangeTabOrder(tabIds: string[]) {
		state.value = changeTabOrder(state.value, tabIds);
	}

	function handlerRemoveTab(tabId: string) {
		state.value = removeTab(state.value, tabId);
	}

	function handlerSwitchTab(tabId: string) {
		state.value = changeActiveTab(state.value, tabId);
	}

	function handlerDuplicateTab(tabId: string) {
		state.value = duplicateTab(state.value, tabId);
	}

	function handlerChangeSectionsVisibility(sectionId: string, isOpen: boolean) {
		state.value = updateTableState(
			state.value,
			table.value,
			activeTab.value,
			t => changeSectionsVisibility(
				t,
				sectionId,
				isOpen,
			),
		);
	}

	function handlerRenameSection(sectionId: string, newName: string) {
		state.value = updateTableState(
			state.value,
			table.value,
			activeTab.value,
			t => renameSection(
				t,
				sectionId,
				newName,
			),
		);
	}

	function handlerMoveRowInSection(sectionId: string, oldIndex: number, newIndex: number) {
		state.value = updateTableState(
			state.value,
			table.value,
			activeTab.value,
			t => moveRowInSection(
				t,
				sectionId,
				oldIndex,
				newIndex,
			),
		);
	}

	function handlerMoveRowBetweenSections(
		fromSectionId: string,
		toSectionId: string,
		rowId: string,
		toIndex: number,
	) {
		state.value = updateTableState(
			state.value,
			table.value,
			activeTab.value,
			t => moveRowBetweenSections(
				t,
				fromSectionId,
				toSectionId,
				rowId,
				toIndex,
			),
		);
	}

	function handlerDeleteSection(sectionId: string) {
		state.value = updateTableState(
			state.value,
			table.value,
			activeTab.value,
			t => deleteSection(
				t,
				sectionId,
			),
		);
	}

	function handlerAddCustomSection() {
		state.value = updateTableState(
			state.value,
			table.value,
			activeTab.value,
			t => addCustomSection(t),
		);
	}

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	function addToWatchlist(payload: IPayload) {
		if (!isPayloadAccept(payload)) {
			return;
		}

		const { tickerType, tickerId, tabId } = payload;

		state.value = addTickerInTab(state.value, tickerId, tickerType, tabId);
	}

	function removeFromWatchlist(payload: IPayload) {
		if (!isPayloadAccept(payload)) {
			return;
		}

		const { tickerType, tickerId, tabId } = payload;

		state.value = deleteTickerInTab(state.value, tickerId, tickerType, tabId);
	}

	function isPayloadAccept(input: unknown): boolean {
		try {
			const payload = payloadSchema.parse(input);

			const { watchlistId } = payload;

			if (watchlistId !== widgetId) {
				return false;
			}

			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				// eslint-disable-next-line no-console
				console.error('Validation failed:', error.issues);
			}
			return false;
		}
	}

	return {
		tabs,
		columns,
		activeSort,
		sections,
		tickerIds,

		handlerAddNewTab,
		handlerRenameTab,
		handlerChangeTabOrder,
		handlerRemoveTab,
		handlerSwitchTab,
		handlerDuplicateTab,

		handlerChangeSectionsVisibility,
		handlerRenameSection,
		handlerMoveRowInSection,
		handlerMoveRowBetweenSections,
		handlerDeleteSection,
		handlerAddCustomSection,

		resetAllChanges,
	};
}
