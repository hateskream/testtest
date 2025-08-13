import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { compareStrings } from '@/shared/lib';
import type { IActiveTabSort, ITableColumn } from '../model';
import { CRYPTO_DEFAULT_SHOW_COLUMNS } from '../model/crypto';

export const useMarketStore = defineStore('dashboards-market', () => {
	const activeTableColumns = ref(CRYPTO_DEFAULT_SHOW_COLUMNS);

	const showTableColumns = computed(() =>
		activeTableColumns.value.map(column => column.displayColumnName),
	);

	const showTableColumnsDraggable = computed(() =>
		activeTableColumns.value.filter(column => column.isDraggable),
	);

	const filterCategories = ref([
		{
			name: 'Crypto',
			value: 'crypto',
			isSelect: true,
		},
		{
			name: 'Stock',
			value: 'stock',
			isSelect: false,
		},
		{
			name: 'Forex',
			value: 'forex',
			isSelect: false,
		},
		{
			name: 'Commodity',
			value: 'commodity',
			isSelect: false,
		},
	]);

	const activeFilterCategory = computed(() => filterCategories.value.find(item => item.isSelect));

	const activeTabSort = ref<IActiveTabSort>({
		direction: 0,
		sortTab: 'all',
	});

	function toggleFilterCategory(value: string) {
		filterCategories.value = filterCategories.value.map(item => {
			if (compareStrings(item.value, value)) {
				return {
					...item,
					isSelect: !item.isSelect,
				};
			}

			return { ...item, isSelect: false };
		});
	}

	function toggleShowActiveTableColumns(_: string) {
		// const idxAllTableColumnItem = INITIAL_ALL_TABLE_COLUMNS.findIndex(column =>
		// 	compareStrings(columnName, column.columnName),
		// )!;

		// const settingsItem = INITIAL_ALL_TABLE_COLUMNS[idxAllTableColumnItem];

		// if (settingsItem.isToggleable) {
		// 	const idxActiveTableColumnItem = activeTableColumns.value.findIndex(column =>
		// 		compareStrings(columnName, column.columnName),
		// 	);

		// 	const data = toValue(activeTableColumns.value);

		// 	if (idxActiveTableColumnItem > -1) {
		// 		setActiveTabSort({
		// 			direction: 0,
		// 			sortTab: 'all',
		// 		});

		// 		data.splice(idxActiveTableColumnItem, 1);
		// 	} else {
		// 		data.splice(settingsItem.position, 0, {
		// 			...settingsItem,
		// 			isShow: true,
		// 		});
		// 	}

		// 	activeTableColumns.value = setPositionColumns(data);
		// }
	}

	function resetAll() {
		updateActiveTableColumns(CRYPTO_DEFAULT_SHOW_COLUMNS);

		activeTabSort.value = {
			direction: 0,
			sortTab: 'all',
		};
	}

	function updateActiveTableColumns(newActiveTableColumns: ITableColumn[]) {
		activeTableColumns.value = newActiveTableColumns;
	}

	return {
		activeTableColumns,
		toggleShowActiveTableColumns,
		activeTabSort,
		showTableColumns,
		toggleFilterCategory,
		filterCategories,
		activeFilterCategory,
		resetAll,
		showTableColumnsDraggable,
		updateActiveTableColumns,
	};
});
