import { defineStore } from 'pinia';
import { computed, ref, toValue } from 'vue';

import {
	ACCEPT_COLUMNS_TYPES_SORT,
	INITIAL_ACTIVE_TABLE_COLUMNS,
	INITIAL_ALL_TABLE_COLUMNS,
} from '../const';
import { getNextDirectionSort, setPositionColumns } from '../utils';
import { compareStrings } from '@/shared/lib';
import type { IActiveSortColumn, IActiveTabSort, ITableColumn } from '../model';

export const useMarketStore = defineStore('dashboards-market', () => {
	const activeTableColumns = ref(INITIAL_ACTIVE_TABLE_COLUMNS);

	const showTableColumns = computed(() =>
		activeTableColumns.value.map(column => column.columnName),
	);

	const activeSort = ref<IActiveSortColumn>({
		columnName: '',
		direction: 0,
	});

	const activeTabSort = ref<IActiveTabSort>({
		direction: 0,
		sortTab: 'all',
	});

	function setActiveTabTimeframe(args: IActiveTabSort) {
		activeTabSort.value = args;

		if (args.columnName) {
			activeSort.value = {
				columnName: args.columnName,
				direction: args.direction,
			};
		}
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

	function toggleActiveSort(column: ITableColumn) {
		if (activeTabSort.value.columnName) {
			return;
		}

		if (ACCEPT_COLUMNS_TYPES_SORT.includes(column.type)) {
			if (activeSort.value.columnName !== column.columnName) {
				activeSort.value = {
					columnName: column.columnName,
					direction: -1,
				};

				return;
			}

			const nextDirection = getNextDirectionSort(activeSort.value.direction);

			activeSort.value = {
				columnName: column.columnName,
				direction: nextDirection,
			};
		}
	}

	function toggleShowActiveTableColumns(columnName: string) {
		const idxAllTableColumnItem = INITIAL_ALL_TABLE_COLUMNS.findIndex(column =>
			compareStrings(columnName, column.columnName),
		)!;

		const settingsItem = INITIAL_ALL_TABLE_COLUMNS[idxAllTableColumnItem];

		if (settingsItem.isToggleable) {
			const idxActiveTableColumnItem = activeTableColumns.value.findIndex(column =>
				compareStrings(columnName, column.columnName),
			);

			const data = toValue(activeTableColumns.value);

			if (idxActiveTableColumnItem > -1) {
				setActiveTabSort({
					direction: 0,
					sortTab: 'all',
				});

				data.splice(idxActiveTableColumnItem, 1);
			} else {
				data.splice(settingsItem.position, 0, {
					...settingsItem,
					isShow: true,
				});
			}

			activeTableColumns.value = setPositionColumns(data);
		}
	}

	return {
		activeTableColumns,
		toggleShowActiveTableColumns,
		toggleActiveSort,
		activeSort,
		activeTabSort,
		setActiveTabSort,
		showTableColumns,
		setActiveTabTimeframe,
	};
});
