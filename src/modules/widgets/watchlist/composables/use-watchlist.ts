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
	moveRowBetweenSections,
	moveRowInSection,
	removeTab,
	renameSection,
	renameTab,
	updateSort,
	updateTableState,
} from '../model';
import type { ISort, ITableColumn } from '@/modules/cell';

export function useWatchlist() {
	const state = ref<IState>(getDefaultState());

	const table = ref<ITable | null>(null);

	const activeTabId = computed({
		get: () => state.value.activeTabId,
		set: (val: string) => {
			state.value = changeActiveTab(state.value, val);
		},
	});

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

	const tabs = computed(() => state.value.tabs);

	const sections = computed(() => table.value?.sections || []);

	watch(
		() => state.value.activeTabId,
		newActiveTabId => {
			if (newActiveTabId === null) {
				return;
			}

			const foundedTab = findTab(state.value, newActiveTabId);
			if (foundedTab === undefined) {
				return;
			}

			table.value = foundedTab.table;
		},
		{ immediate: true },
	);

	function handlerAddNewTab(name: string) {
		state.value = addNewTab(state.value, name);
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

	return {
		activeTabId,
		tabs,
		columns,
		activeSort,
		sections,

		handlerAddNewTab,
		handlerRenameTab,
		handlerChangeTabOrder,
		handlerRemoveTab,

		handlerChangeSectionsVisibility,
		handlerRenameSection,
		handlerMoveRowInSection,
		handlerMoveRowBetweenSections,
		handlerDeleteSection,
		handlerAddCustomSection,
	};
}
