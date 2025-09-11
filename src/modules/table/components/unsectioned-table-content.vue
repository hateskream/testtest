<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';

import type {
	IGenericTableColumn,
	IGenericTableRow,
	ISortConfig,
	IDragDropEvent,
	IDragEvent,
} from '../type';
import { useTableData, useTableDragDrop } from '../table-common';

export interface IProps<T> {
	rows: IGenericTableRow<T>[];
	columns: IGenericTableColumn[];
	containerWidth: number;
	sortConfig: ISortConfig;
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
	enableColumnSettings?: boolean;
}

export interface IEmits<T> {
	(e: 'update:rows', rows: IGenericTableRow<T>[]): void;

	(e: 'rowMoved', payload: IDragDropEvent<T>): void;

	(e: 'rowDeleted', payload: { rowId: string }): void;

	(e: 'click-on-row', tickerId: string): void;
}

const props = withDefaults(defineProps<IProps<T>>(), {
	enableDragDrop: true,
	stickyFirstColumn: true,
	enableRowActions: true,
	enableColumnSettings: false,
});

const emit = defineEmits<IEmits<T>>();

const { sortData } = useTableData();
const { handleDragChange } = useTableDragDrop();

const hoveredRowId = ref<string | null>(null);
const isDragging = ref<boolean>(false);

const handleRowMouseEnter = (rowId: string) => {
	if (!isDragging.value) {
		hoveredRowId.value = rowId;
	}
};

const handleRowMouseLeave = () => {
	if (!isDragging.value) {
		hoveredRowId.value = null;
	}
};

const handleDragStart = () => {
	isDragging.value = true;
	hoveredRowId.value = null;
};

const handleDragEnd = () => {
	isDragging.value = false;
};

const shouldUseColspan = computed(() => props.enableColumnSettings && !props.enableRowActions);

const sortedRows = computed(() => {
	if (!props.sortConfig || props.sortConfig.direction === 'none' || !props.sortConfig.columnKey) {
		return props.rows;
	}

	const sortColumn = props.columns.find(col => col.key === props.sortConfig.columnKey);
	if (!sortColumn) {
		return props.rows;
	}

	return sortData(props.rows, sortColumn, props.sortConfig.direction);
});

const onRowDragChange = (evt: IDragEvent<T>) => {
	handleDragChange(
		evt,
		'unsorted',
		(sectionId: string, oldIndex: number, newIndex: number) => {
			emit('rowMoved', {
				type: 'moved',
				sectionId: sectionId,
				oldIndex,
				newIndex,
			});
		},
		(evtTransfer: IDragEvent<T>) => {
			if (evtTransfer.added) {
				emit('rowMoved', {
					type: 'added',
					sectionId: 'unsorted',
					newIndex: evtTransfer.added.newIndex,
					element: evtTransfer.added.element,
				});
			}
			if (evtTransfer.removed) {
				emit('rowMoved', {
					type: 'removed',
					sectionId: 'unsorted',
					oldIndex: evtTransfer.removed.oldIndex,
					element: evtTransfer.removed.element,
				});
			}
		},
	);
};


</script>

<template generic="T">
	<draggable
		:class="[classes.tableBody, { [classes.dragging]: isDragging }]"
		:model-value="sortedRows"
		:group="enableDragDrop ? 'table-rows' : false"
		:disabled="!enableDragDrop"
		item-key="id"
		tag="tbody"
		@change="onRowDragChange"
		@start="handleDragStart"
		@end="handleDragEnd"
	>
		<template #item="{ element: row, index: rowIndex }">
			<tr
				:key="row.id"
				:class="[classes.tableRow, { [classes.tableRowHovered]: hoveredRowId === row.id }]"
				@mouseenter="handleRowMouseEnter(row.id)"
				@mouseleave="handleRowMouseLeave"
				@click="emit('click-on-row', row.id)"
			>
				<td
					v-for="(column, cellIndex) in columns"
					:key="`${row.id}-${column.key}`"
					:class="[
						classes.tableCell,
						{
							[classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn,
							[classes.stickyFirstCellHovered]: cellIndex === 0 &&
								stickyFirstColumn && hoveredRowId === row.id,
						}
					]"
					:style="{
						...(cellIndex !== 0 ? {width: `var(--col-${cellIndex}-width)`} : {}),
						minWidth: `var(--col-${cellIndex}-min-width)`
					}"
					:colspan="shouldUseColspan && cellIndex + 1 === columns.length ? 2 : 1"
				>
					<slot
						:name="`cell-${cellIndex}`"
						:row="row"
						:column="column"
						:cell-index="cellIndex"
						:row-index="rowIndex"
						:value="row.data[column.key]"
					>
						{{ row.data[column.key] }}
					</slot>
				</td>

				<td
					v-if="enableRowActions"
					:class="
						[classes.rowActions, classes.tableCell, {[classes.rowActionsHovered]: hoveredRowId === row.id}]
					"
				>
					<slot name="row-actions" :ticker-id="row.id" />
				</td>
			</tr>
		</template>

		<template #ghost="{ element: row }">
			<tr :class="classes.ghostRow">
				<td
					v-for="(column, cellIndex) in columns"
					:key="`ghost-${row.id}-${column.key}`"
					:class="[
						classes.ghostCell,
						{
							[classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn,
						}
					]"
					:style="{
						width: `var(--col-${cellIndex}-width)`,
						minWidth: `var(--col-${cellIndex}-width)`
					}"
				>
					{{ row.data[column.key] }}
				</td>
			</tr>
		</template>
	</draggable>
</template>

<style module="classes">
.tableBody {
	user-select: none;
}

.dragging {
	.tableRow:hover {
		background-color: transparent !important;
	}

	td * {
		position: relative;
		pointer-events: none;

		&:global(.content-anchor) {
			display: none;
		}
	}

	.stickyFirstCellHovered {
		background: var(--bg-color-surface-01);
	}
}

.tableRowHovered {
	background-color: var(--border-color-surface-01-effect);

	.rowActions {
		opacity: 1;
	}

	.columnSettings {
		opacity: 1;
	}
}

.tableCell {
	position: relative;
	min-height: 50px;
	padding: 8px 12px;
	overflow: hidden;
	vertical-align: middle;
	white-space: nowrap;
	text-overflow: ellipsis;
	background: transparent;
	border: none;
}

.stickyFirstCell {
	position: sticky;
	left: 0;
	z-index: 10;
	background:
		linear-gradient(
			to right,
			var(--bg-color-surface-01, #1a1a1a) 65%,
			rgb(26 26 26 / 0%) 100%
		);
}

.stickyFirstCellHovered {
	background:
		linear-gradient(
			to right,
			rgb(32 32 32 / 100%) 65%,
			rgb(32 32 32 / 0%) 100%
		);
}

.actionsCell {
	position: relative;
	width: 50px;
	min-width: 50px;
	padding: 8px;
	vertical-align: middle;
	text-align: center;
	background: var(--bg-color-surface-01);
	border: none;
}

.rowActions {
	position: sticky;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;

	&.rowActionsHovered {
		background:
			linear-gradient(
				to left,
				rgb(32 32 32 / 100%) 65%,
				rgb(32 32 32 / 0%) 100%
			);
	}
}

.columnSettings {
	position: sticky;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;

	&.columnSettingsHovered {
		background:
			linear-gradient(
				to left,
				rgb(32 32 32 / 100%) 65%,
				rgb(32 32 32 / 0%) 100%
			);
	}
}

.ghostRow {
	background: var(--border-color-surface-01-effect) !important;
	border: 2px dashed rgb(59 130 246 / 50%) !important;
	opacity: 0.7 !important;
}

.ghostCell {
	color: var(--text-color-base-200) !important;
	background: transparent !important;
	border: none !important;
}
</style>
