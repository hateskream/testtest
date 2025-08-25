import { computed, ref, watch } from 'vue';

import {
	type IState,
	type ITable,
	addCustomSection,
	addNewTab,
	changeActiveTab,
	changeColumnsState,
	changeSectionsVisibility,
	changeTabOrder,
	deleteSection,
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

export function useWatchlist(widgetId: string) {
	const { data: dataState } = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

	const state = ref<IState>(getDefaultState());

	const table = ref<ITable | null>(null);
	const tabs = computed(() => getUiTabs(state.value));
	const sections = computed(() => table.value?.sections || []);

	const activeTab = computed(() => getActiveTab(state.value));

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

	return {
		tabs,
		columns,
		activeSort,
		sections,

		handlerAddNewTab,
		handlerRenameTab,
		handlerChangeTabOrder,
		handlerRemoveTab,
		handlerSwitchTab,

		handlerChangeSectionsVisibility,
		handlerRenameSection,
		handlerMoveRowInSection,
		handlerMoveRowBetweenSections,
		handlerDeleteSection,
		handlerAddCustomSection,

		resetAllChanges,
	};
}
