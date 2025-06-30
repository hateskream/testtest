<script setup lang="ts">
import { computed } from 'vue';
import { GridLayout, GridItem, type LayoutItem } from 'grid-layout-plus';

import { useWatchlistStore } from '../../../../stores';
import { INITIAL_ALL_TABLE_COLUMNS } from '../../../../const';
import type { ITableColumn } from '../../../../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiDriver } from '@/shared/ui/driver';
import { setPositionColumns } from '../../../../utils';
import { ModalFilter, ModalFilterTabWrapper, ModalFilterTitle } from '../../../../../base';

interface IGridLayoutCell extends LayoutItem {
	data: ITableColumn;
}

const watchlistStore = useWatchlistStore();

const groupedTableColumns = computed(() => {
	const grouped: { [x: string]: ITableColumn[] } = {};

	// Объединяем все возможные колонки: видимые из store + скрытые из константы
	const allAvailableColumns: ITableColumn[] = [];

	// Добавляем все колонки из константы как базу
	INITIAL_ALL_TABLE_COLUMNS.forEach(column => {
		allAvailableColumns.push(column);
	});

	// Обновляем статус isShow на основе данных из store
	const storeColumnNames = watchlistStore.showTableColumns;
	allAvailableColumns.forEach(column => {
		column.isShow = storeColumnNames.includes(column.columnName);
	});

	// Группируем колонки
	allAvailableColumns.forEach(column => {
		if (!Array.isArray(grouped[column.group.name])) {
			grouped[column.group.name] = [column];
		} else {
			grouped[column.group.name].push(column);
		}
	});

	return grouped;
});

const layout = computed<IGridLayoutCell[]>(() =>
	watchlistStore.showTableColumnsDraggable.map((item, index) => ({
		x: 0,
		y: index + 1,
		w: 12,
		h: 1,
		i: `${item.columnType || item.columnName || item.id || index}`, // Используем уникальный идентификатор
		static: !item.isDraggable,
		data: item,
	})),
);

const gridConfig = {
	colNum: 12,
	rowHeight: 32,
	margin: [0, 8],
	isDraggable: true,
	isResizable: false,
};

function handleUpdatePositionsColumns(itemId: string, _x: number, y: number) {
	// TODO: fix with isDragging and first element

	// Находим элемент по уникальному ID
	const movedItem = layout.value.find(item => item.i === itemId);
	if (!movedItem) {
		return;
	}

	const activeTableColumns = setPositionColumns(
		[
			watchlistStore.activeTableColumns[0],
			...layout.value.map(item => ({
				...item.data,
				position: item.i === itemId ? y : item.y,
			})),
		].sort((a, b) => a.position - b.position),
	);

	watchlistStore.updateActiveTableColumns(activeTableColumns);
}

function handleToggleTab(columnName: string) {
	watchlistStore.toggleShowActiveTableColumns(columnName);
}
</script>

<template>
	<modal-filter>
		<template #title> Choose Metrics </template>

		<template #content>
			<div>
				<div
					v-for="(columns, key) in groupedTableColumns"
					:key="key"
					:class="classes.row"
				>
					<div :class="classes.rowTitle">
						{{ key }}
					</div>

					<div>
						<div :class="classes.tabs">
							<modal-filter-tab-wrapper
								v-for="tab in columns"
								:key="tab.columnName"
								:is-active="watchlistStore.showTableColumns.includes(tab.columnName)"
								@click="handleToggleTab(tab.columnName)"
							>
								{{ tab.displayShortColumnName }}
							</modal-filter-tab-wrapper>
						</div>
					</div>
				</div>
			</div>

			<ui-driver :class="classes.driver" />

			<div>
				<modal-filter-title> Column order </modal-filter-title>

				<div>
					<grid-layout
						:layout="layout"
						:col-num="gridConfig.colNum"
						:row-height="gridConfig.rowHeight"
						:margin="gridConfig.margin"
						:is-draggable="gridConfig.isDraggable"
						:is-resizable="gridConfig.isResizable"
						:vertical-compact="true"
						:class="classes.columnCellTabs"
					>
						<grid-item
							v-for="item in layout"
							:key="item.i"
							:x="item.x"
							:y="item.y"
							:w="item.w"
							:h="item.h"
							:i="item.i"
							:static="item.static"
							:class="classes.columnCellTab"
							@moved="handleUpdatePositionsColumns"
						>
							<ui-icon
								v-if="!item.static"
								:id="IconIds.DoubleDrag"
								:class="classes.icon"
								width="10px"
								height="14px"
							/>
							<modal-filter-tab-wrapper :class="classes.columnCellTabWrapper">
								<span :class="classes.columnCellTabOrder">{{ item.y + 1 }}</span>
								<span>
									{{ item.data.displayColumnName }}
								</span>
							</modal-filter-tab-wrapper>
						</grid-item>
					</grid-layout>
				</div>
			</div>
		</template>
	</modal-filter>
</template>

<style module="classes">
.driver {
	margin: 28px 0 12px;
}

.columnCellTabWrapper {
	color: var(--text-color-base-500);
}

.columnCellTabOrder {
	color: var(--text-color-base-300);
}

.columnCellTab {
	display: flex;
	align-items: center;
	gap: 12px;
}

.tabs {
	display: flex;
	gap: 8px;
	align-items: center;
}

.icon {
	margin-left: 6px;
	color: var(--icon-color-base-300);
}

.row {
	display: flex;
	align-items: center;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
