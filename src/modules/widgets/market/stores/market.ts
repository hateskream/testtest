import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	INITIAL_ACTIVE_TABLE_COLUMNS,
} from '../const';
import { getNextDirectionSort } from '../utils';
import { compareStrings } from '@/shared/lib';
import type { IActiveSortColumn, IActiveTabSort, ITableColumn } from '../model';

export const useMarketStore = defineStore('dashboards-market', () => {
	const activeTableColumns = ref(INITIAL_ACTIVE_TABLE_COLUMNS);

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

	const activeSort = ref<IActiveSortColumn>({
		columnName: '',
		direction: 0,
	});

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

	function setActiveTabSort(args: IActiveTabSort) {
		if (args.columnName) {
			let { direction } = args;

			if (activeTabSort.value.sortTab === args.sortTab) {
				direction = getNextDirectionSort(activeSort.value.direction);
			}

			activeSort.value = {
				direction,
				columnName: args.columnName,
			};
		} else {
			activeSort.value = {
				columnName: '',
				direction: 0,
			};
		}

		activeTabSort.value = args;
	}

	function toggleActiveSort(_: ITableColumn) {
		// if (activeTabSort.value.columnName) {
		// 	return;
		// }

		// if (ACCEPT_COLUMNS_TYPES_SORT.includes(column.type)) {
		// 	if (activeSort.value.columnName !== column.columnName) {
		// 		activeSort.value = {
		// 			columnName: column.columnName,
		// 			direction: -1,
		// 		};

		// 		return;
		// 	}

		// 	const nextDirection = getNextDirectionSort(activeSort.value.direction);

		// 	activeSort.value = {
		// 		columnName: column.columnName,
		// 		direction: nextDirection,
		// 	};
		// }
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
		updateActiveTableColumns(INITIAL_ACTIVE_TABLE_COLUMNS);

		activeSort.value = {
			columnName: '',
			direction: 0,
		};

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
		toggleActiveSort,
		activeSort,
		activeTabSort,
		setActiveTabSort,
		showTableColumns,
		toggleFilterCategory,
		filterCategories,
		activeFilterCategory,
		resetAll,
		showTableColumnsDraggable,
		updateActiveTableColumns,
	};
});
