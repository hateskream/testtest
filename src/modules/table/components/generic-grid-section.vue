<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, computed, nextTick } from 'vue';
import draggable from 'vuedraggable';

import type {
	IGenericTableSection,
	IGenericTableColumn,
	IGenericTableRow,
	ISortConfig,
	IDragDropEvent,
	IDragEvent,
} from '../type';
import { useTableData, useTableDragDrop, useTableLayout } from '../table-common';

export interface IProps<T> {
	sections: IGenericTableSection<T>[];
	unsortedRows: IGenericTableRow<T>[];
	columns: IGenericTableColumn[];
	sortConfig: ISortConfig;
	canAddSections?: boolean;
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
	enableColumnSettings?: boolean;
}

export interface IEmits<T> {
	(e: 'update:sections', sections: IGenericTableSection<T>[]): void;
	(e: 'update:unsorted-rows', rows: IGenericTableRow<T>[]): void;
	(e: 'rowMoved', payload: IDragDropEvent<T>): void;
	(e: 'rowDeleted', payload: { rowId: string; sectionId: string }): void;
	(e: 'sectionToggled', sectionId: string): void;
	(e: 'sectionAdded', sectionName: string): void;
	(e: 'sectionDeleted', sectionId: string): void;
	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;
}

const props = withDefaults(defineProps<IProps<T>>(), {
	enableDragDrop: true,
	stickyFirstColumn: true,
	enableRowActions: true,
	enableColumnSettings: false,
	canAddSections: false,
});

const emit = defineEmits<IEmits<T>>();

const { sortData } = useTableData();
const { handleDragChange } = useTableDragDrop();
const { getColumnStyles,
	getTotalColumnSpan,
	// getDataColumnSpan,
} = useTableLayout();

// Track which row is currently being hovered
const hoveredRowId = ref<string | null>(null);

// Add section functionality
const showAddSectionInput = ref(false);
const addSectionInputRef = ref<HTMLInputElement>();
const newSectionName = ref('New section');

// Hover handlers for individual rows
const handleRowMouseEnter = (rowId: string) => {
	hoveredRowId.value = rowId;
};

const handleRowMouseLeave = () => {
	hoveredRowId.value = null;
};

const hasActionsOrSettings = computed(() => props.enableRowActions || props.enableColumnSettings);

const columnStyles = computed(() => {
	return getColumnStyles(props.columns);
});

const totalColumnSpan = computed(() => {
	return getTotalColumnSpan(props.columns.length, hasActionsOrSettings.value);
});


const sortedSections = computed(() => {
	if (!props.sortConfig || props.sortConfig.direction === 'none' || !props.sortConfig.columnKey) {
		return props.sections;
	}

	const sortColumn = props.columns.find(col => col.key === props.sortConfig.columnKey);
	if (!sortColumn) {
		return props.sections;
	}

	return props.sections.map(section => {
		const sortedRows = sortData(
			section.rows,
			sortColumn,
			props.sortConfig.direction,
		);

		return {
			...section,
			rows: sortedRows,
		};
	});
});

const sortedUnsortedRows = computed(() => {
	if (!props.sortConfig || props.sortConfig.direction === 'none' || !props.sortConfig.columnKey) {
		return props.unsortedRows;
	}

	const sortColumn = props.columns.find(col => col.key === props.sortConfig.columnKey);
	if (!sortColumn) {
		return props.unsortedRows;
	}

	return sortData(props.unsortedRows, sortColumn, props.sortConfig.direction);
});

const handleSectionToggle = (sectionId: string) => {
	emit('sectionToggled', sectionId);
};

// const handleRowMoved = (payload: IDragDropEvent<T>) => {
// 	emit('rowMoved', payload);
// };

// const handleRowDeleted = (payload: { rowId: string; sectionId: string }) => {
// 	emit('rowDeleted', payload);
// };

const handleSectionDelete = (sectionId: string) => {
	emit('sectionDeleted', sectionId);
};

// const handleSectionRename = (payload: { sectionId: string; newName: string }) => {
// 	emit('sectionRenamed', payload);
// };

const onUnsortedDragChange = (evt: IDragEvent<T>) => {
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
			if (evt.removed) {
				emit('rowMoved', {
					type: 'removed',
					sectionId: 'unsorted',
					oldIndex: evt.removed.oldIndex,
					element: evt.removed.element,
				});
			}
		},
	);
};

const onSectionDragChange = (evt: IDragEvent<T>, sectionId: string) => {
	handleDragChange(
		evt,
		sectionId,
		(sId: string, oldIndex: number, newIndex: number) => {
			emit('rowMoved', {
				type: 'moved',
				sectionId: sId,
				oldIndex,
				newIndex,
			});
		},
		(evtTransfer: IDragEvent<T>) => {
			if (evtTransfer.added) {
				emit('rowMoved', {
					type: 'added',
					sectionId,
					newIndex: evtTransfer.added.newIndex,
					element: evtTransfer.added.element,
				});
			}
			if (evt.removed) {
				emit('rowMoved', {
					type: 'removed',
					sectionId,
					oldIndex: evt.removed.oldIndex,
					element: evt.removed.element,
				});
			}
		},
	);
};

const handleUnsortedRowDeleted = (rowId: string) => {
	emit('rowDeleted', {
		rowId,
		sectionId: 'unsorted',
	});
};

const handleSectionRowDeleted = (rowId: string, sectionId: string) => {
	emit('rowDeleted', {
		rowId,
		sectionId,
	});
};

const showAddSection = () => {
	showAddSectionInput.value = true;
	nextTick(() => {
		addSectionInputRef.value?.focus();
		addSectionInputRef.value?.select();
	});
};

const saveNewSection = (event: Event) => {
	if (event.type !== 'blur') {
		addSectionInputRef.value?.blur();
		return;
	}

	if (newSectionName.value.trim()) {
		emit('sectionAdded', newSectionName.value.trim());
	}

	newSectionName.value = 'New section';
	showAddSectionInput.value = false;
};

const cancelAddSection = () => {
	newSectionName.value = 'New section';
	showAddSectionInput.value = false;
};
</script>

<template generic="T">
	<tbody :class="classes.sectionedTableBody" :style="columnStyles">
		<!-- Unsorted rows area -->
		<template v-if="sortedUnsortedRows.length > 0">
			<draggable
				:model-value="sortedUnsortedRows"
				:group="enableDragDrop ? 'table-rows' : false"
				:disabled="!enableDragDrop"
				item-key="id"
				tag="template"
				@change="onUnsortedDragChange"
			>
				<template #item="{ element: row, index: rowIndex }">
					<tr
						:key="row.id"
						:class="[classes.tableRow, { [classes.tableRowHovered]: hoveredRowId === row.id }]"
						@mouseenter="handleRowMouseEnter(row.id)"
						@mouseleave="handleRowMouseLeave"
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
								width: `var(--col-${cellIndex}-width)`,
								minWidth: `var(--col-${cellIndex}-width)`
							}"
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
							v-if="hasActionsOrSettings"
							:class="classes.actionsCell"
						>
							<div v-if="enableRowActions" :class="classes.rowActions">
								<button
									:class="[classes.rowActionBtn, classes.deleteBtn]"
									title="Delete row"
									@click="handleUnsortedRowDeleted(row.id)"
								>
									<span :class="classes.deleteIcon">🗑️</span>
								</button>
							</div>
						</td>
					</tr>
				</template>
			</draggable>
		</template>

		<!-- Sections -->
		<template
			v-for="section in sortedSections"
			:key="section.id"
		>
			<!-- Section Header -->
			<tr :class="classes.sectionHeaderRow">
				<td
					:class="classes.sectionHeader"
					:colspan="totalColumnSpan"
					@click="handleSectionToggle(section.id)"
				>
					<div :class="classes.sectionHeaderContent">
						<div :class="classes.sectionToggle">
							<span :class="[classes.toggleIcon, { [classes.collapsed]: section.isCollapsed }]">
								▼
							</span>
						</div>
						<div :class="classes.sectionTitle">
							<slot name="section-header" :section="section">
								{{ section.title }}
							</slot>
						</div>
						<div :class="classes.sectionActions">
							<button
								:class="[classes.sectionActionBtn, classes.deleteBtn]"
								title="Delete section"
								@click.stop="handleSectionDelete(section.id)"
							>
								<span :class="classes.deleteIcon">🗑</span>
							</button>
						</div>
					</div>
				</td>
			</tr>

			<!-- Section Rows -->
			<template v-if="!section.isCollapsed">
				<draggable
					:model-value="section.rows"
					:group="enableDragDrop ? 'table-rows' : false"
					:disabled="!enableDragDrop"
					item-key="id"
					tag="template"
					@change="(evt) => onSectionDragChange(evt, section.id)"
				>
					<template #item="{ element: row, index: rowIndex }">
						<tr
							:key="row.id"
							:class="[classes.tableRow, { [classes.tableRowHovered]: hoveredRowId === row.id }]"
							@mouseenter="handleRowMouseEnter(row.id)"
							@mouseleave="handleRowMouseLeave"
						>
							<td
								v-for="(column, cellIndex) in columns"
								:key="`${row.id}-${column.key}`"
								:class="[
									classes.tableCell,
									{
										[classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn,
										[classes.stickyFirstCellHovered]: cellIndex === 0
											&& stickyFirstColumn && hoveredRowId === row.id,
									}
								]"
								:style="{
									width: `var(--col-${cellIndex}-width)`,
									minWidth: `var(--col-${cellIndex}-width)`
								}"
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
								v-if="hasActionsOrSettings"
								:class="classes.actionsCell"
							>
								<div v-if="enableRowActions" :class="classes.rowActions">
									<button
										:class="[classes.rowActionBtn, classes.deleteBtn]"
										title="Delete row"
										@click="handleSectionRowDeleted(row.id, section.id)"
									>
										<span :class="classes.deleteIcon">🗑️</span>
									</button>
								</div>
							</td>
						</tr>
					</template>
				</draggable>
			</template>
		</template>

		<!-- Add section input -->
		<tr v-if="showAddSectionInput" :class="classes.addSectionRow">
			<td :colspan="totalColumnSpan" :class="classes.addSectionCell">
				<input
					ref="addSectionInputRef"
					v-model="newSectionName"
					type="text"
					:class="classes.sectionInput"
					@blur="saveNewSection"
					@keydown.enter="saveNewSection"
					@keydown.esc="cancelAddSection"
				/>
			</td>
		</tr>

		<!-- Add section button -->
		<tr v-if="props.canAddSections" :class="classes.addSectionRow">
			<td
				:colspan="totalColumnSpan"
				:class="classes.addSectionButton"
				@click="showAddSection"
			>
				<span :class="classes.addIcon">+</span>
				<span>Add section</span>
			</td>
		</tr>
	</tbody>
</template>

<style module="classes">
.sectionedTableBody {
	user-select: none;
}

.tableRow {
	border-bottom: 1px solid rgb(255 255 255 / 5%);
	transition: background-color 0.2s ease;
}

.tableRowHovered {
	background-color: var(--border-color-surface-01-effect);
}

.tableRowHovered .tableCell:first-child {
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.tableRowHovered .actionsCell {
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
}

.tableRowHovered .tableCell:last-child:not(.actionsCell) {
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
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
	position: sticky !important;
	left: 0 !important;
	z-index: 10 !important;
	background: var(--bg-color-surface-01) !important;
	border-right: 1px solid rgb(255 255 255 / 5%) !important;
}

.stickyFirstCellHovered {
	background: rgb(32 32 32 / 100%) !important;
}

.stickyFirstCell::before {
	content: '';
	position: absolute;
	top: 0;
	right: -1px;
	bottom: 0;
	z-index: 1;
	width: 1px;
	background: rgb(255 255 255 / 5%);
}

.sectionHeaderRow {
	border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.sectionHeader {
	padding: 0;
	background: var(--bg-color-surface-02, #2a2a2a);
	border: none;
	cursor: pointer;
	transition: background-color 0.2s ease;
	user-select: none;
}

.sectionHeader:hover {
	background: var(--bg-color-surface-02-hover, #333333);
}

.sectionHeaderContent {
	display: flex;
	align-items: center;
	width: 100%;
	min-height: 44px;
	padding: 0 12px;
}

.sectionToggle {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	margin-right: 8px;
}

.toggleIcon {
	font-size: 12px;
	color: var(--text-color-base-200, #cccccc);
	transition: transform 0.2s ease;
}

.toggleIcon.collapsed {
	transform: rotate(-90deg);
}

.sectionTitle {
	flex: 1;
	min-width: 0;
	overflow: hidden;
	font-weight: 500;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	white-space: nowrap;
	text-overflow: ellipsis;
}

.sectionActions {
	display: flex;
	gap: 4px;
	margin-left: auto;
}

.sectionActionBtn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 28px;
	height: 28px;
	background: transparent;
	border: 1px solid transparent;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.sectionActionBtn:hover {
	background: rgb(255 255 255 / 10%);
	border-color: rgb(255 255 255 / 20%);
}

.deleteBtn:hover {
	background: rgb(255 77 79 / 20%);
	border-color: rgb(255 77 79 / 40%);
}

.deleteIcon {
	font-size: 14px;
	color: var(--text-color-base-300, #9a9a9d);
	transition: color 0.2s ease;
}

.deleteBtn:hover .deleteIcon {
	color: #ff4d4f;
}

.actionsCell {
	position: relative;
	width: 50px;
	min-width: 50px;
	max-width: 50px;
	padding: 8px;
	vertical-align: middle;
	text-align: center;
	background: transparent;
	border: none;
}

.rowActions {
	display: flex;
	justify-content: center;
	gap: 4px;
	opacity: 0;
	transition: opacity 0.2s ease;
}

.tableRowHovered .rowActions {
	opacity: 1;
}

.rowActionBtn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 28px;
	height: 28px;
	background: transparent;
	border: 1px solid transparent;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.rowActionBtn:hover {
	background: rgb(255 255 255 / 10%);
	border-color: rgb(255 255 255 / 20%);
}

.addSectionRow {
	border-bottom: none;
}

.addSectionCell {
	padding: 12px 8px;
	border: none;
}

.sectionInput {
	width: 100%;
	font-weight: 440;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	letter-spacing: 0.096px;
	background-color: transparent;
	border: none;
	outline: none;
}

.addSectionButton {
	display: flex;
	align-items: center;
	min-height: 44px;
	padding: 12px 8px;
	font-weight: 440;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	border: none;
	cursor: pointer;
	transition: color 0.2s ease;
}

.addSectionButton:hover {
	color: rgb(131 132 135 / 90%);
}

.addIcon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 12px;
	height: 12px;
	margin-right: 6px;
	font-size: 12px;
	color: var(--text-color-base-100, #ffffff);
	transition: color 0.2s ease;
}

.addSectionButton:hover .addIcon {
	color: rgb(131 132 135 / 90%);
}
</style>
