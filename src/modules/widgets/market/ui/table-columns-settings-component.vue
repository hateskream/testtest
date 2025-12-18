<script setup lang="ts">
import { computed } from 'vue';
import { GridLayout, GridItem, type LayoutItem } from 'grid-layout-plus';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalFilterTitle } from '../../base';
import { CRYPTO_ALL_COLUMNS } from '../model/crypto';
import {
	groupTableColumns,
	toggleShowTableColumns,
	updatePositionsColumns,
	type ColumnType,
	type ITableColumn,
} from '@/modules/cell';
import { UiModalContent, UiModalDivider, UiModalTitle, UiModalWrapper } from '@/shared/ui/modal';
import { UiFilterChip, UiFilterChipWrapper, UiFilterRow, UiFilterSectionLabel } from '@/shared/ui/modal-filter';

interface IGridLayoutCell extends LayoutItem {
	data: ITableColumn;
}

const columns = defineModel<ITableColumn[]>({ required: true });

const showTableColumns = computed(() =>
	columns.value.map(column => column.displayColumnName),
);

const showTableColumnsDraggable = computed(() =>
	columns.value.filter(column => column.isDraggable),
);

const groupedTableColumns = computed(() => groupTableColumns(CRYPTO_ALL_COLUMNS));

const layout = computed<IGridLayoutCell[]>(() =>
	showTableColumnsDraggable.value.map((item, index) => ({
		x: 0,
		y: index + 1,
		w: 12,
		h: 1,
		i: item.columnType,
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

function handleUpdatePositionsColumns(columnName: string, _x: number, y: number) {
	columns.value = updatePositionsColumns(
		columns.value,
		layout.value,
		columnName,
		y,
	);
}

function toggleShowActiveTableColumns(columnType: ColumnType) {
	columns.value = toggleShowTableColumns(columns.value, columnType);
}
</script>

<template>
	<ui-modal-wrapper :class="classes.wrapper" display-variant="default">
		<ui-modal-title>
			Choose Metrics
		</ui-modal-title>

		<ui-modal-content>
			<div :class="classes.rows">
				<ui-filter-row v-for="(cols, key) in groupedTableColumns" :key="key">
					<ui-filter-section-label>
						{{key}}
					</ui-filter-section-label>
					<ui-filter-chip-wrapper>
						<ui-filter-chip
							v-for="tab in cols"
							:key="tab.columnType"
							:is-active="showTableColumns.includes(tab.columnType)"
							@click="toggleShowActiveTableColumns(tab.columnType)"
						>
							{{tab.displayColumnName}}
						</ui-filter-chip>
					</ui-filter-chip-wrapper>
				</ui-filter-row>
			</div>

			<ui-modal-divider :class="classes.driver" />

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
							<ui-filter-chip :class="classes.columnCellTabWrapper">
								<span :class="classes.columnCellTabOrder">{{ item.y + 1 }}</span>
								<span>
									{{ item.data.displayColumnName }}
								</span>
							</ui-filter-chip>
						</grid-item>
					</grid-layout>
				</div>
			</div>
		</ui-modal-content>
	</ui-modal-wrapper>
</template>

<style module="classes">
.wrapper {
	width: 580px;
}

.rows {
	padding: 0 12px;
}

.driver {
	margin: 12px 0 0;
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
