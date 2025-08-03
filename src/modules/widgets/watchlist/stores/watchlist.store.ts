import { defineStore } from 'pinia';
import { computed, ref, toValue } from 'vue';

import {
	ACCEPT_COLUMNS_TYPES_SORT,
	INITIAL_ACTIVE_TABLE_COLUMNS,
	INITIAL_ALL_TABLE_COLUMNS,
} from '../const';
import { getNextDirectionSort, setPositionColumns } from '../utils';
import { compareStrings } from '@/shared/lib';
import type { IActiveSortColumn, ITableColumn, ITableRowValueType } from '../model';

export const useWatchlistStore = defineStore('dashboards-watchlist', () => {
	const activeTableColumns = ref(INITIAL_ACTIVE_TABLE_COLUMNS);

	const showTableColumns = computed(() =>
		activeTableColumns.value.map(column => column.columnName),
	);

	const showTableColumnsDraggable = computed(() =>
		activeTableColumns.value.filter(column => column.isDraggable),
	);

	const favorites = ref<string[]>([]);
	const isFavorites = ref<boolean>(false);

	const activeSort = ref<IActiveSortColumn>({
		columnName: '',
		direction: 0,
	});

	function addToFavorites(id: string) {
		favorites.value.push(id);
	}

	function removeFromFavorites(id: string) {
		const idx = favorites.value.findIndex(item => item === id);

		if (idx > -1) {
			favorites.value.splice(idx, 1);
		}
	}

	function toggleFavorites() {
		isFavorites.value = !isFavorites.value;
	}

	function toggleFavoriteItem(id: string) {
		if (favorites.value.includes(id)) {
			removeFromFavorites(id);
		} else {
			addToFavorites(id);
		}
	}

	function toggleActiveSort(column: ITableColumn) {
		if (ACCEPT_COLUMNS_TYPES_SORT.includes(column.columnType as ITableRowValueType)) {
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
				activeSort.value = {
					columnName: '',
					direction: 0,
				};

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

	function updateActiveTableColumns(newActiveTableColumns: ITableColumn[]) {
		activeTableColumns.value = setPositionColumns(newActiveTableColumns);
	}

	function resetAll() {
		// TODO: Implement reset all
	}

	return {
		activeTableColumns,
		showTableColumns,
		showTableColumnsDraggable,
		activeSort,
		isFavorites,
		favorites,
		addToFavorites,
		removeFromFavorites,
		toggleFavorites,
		toggleFavoriteItem,
		toggleActiveSort,
		toggleShowActiveTableColumns,
		updateActiveTableColumns,
		resetAll,
	};
});
