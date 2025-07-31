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
import { useTableData, useTableDragDrop } from '../composables/use-table-data.ts';

import GenericGridSection from './generic-grid-section.vue';

export interface IProps<T> {
	sections: IGenericTableSection<T>[];
	unsortedRows: IGenericTableRow<T>[];
	columns: IGenericTableColumn[];
	sortConfig: ISortConfig;
	canAddSections?: boolean;
	gridTemplateColumns: string;
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
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
	canAddSections: false,
});

const emit = defineEmits<IEmits<T>>();

const { sortData } = useTableData();
const { handleDragChange } = useTableDragDrop();

const showAddSectionInput = ref(false);
const addSectionInputRef = ref<HTMLInputElement>();
const newSectionName = ref('New section');

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

const handleRowMoved = (payload: IDragDropEvent<T>) => {
	emit('rowMoved', payload);
};

const handleRowDeleted = (payload: { rowId: string; sectionId: string }) => {
	emit('rowDeleted', payload);
};

const handleSectionDelete = (sectionId: string) => {
	emit('sectionDeleted', sectionId);
};

const handleSectionRename = (payload: { sectionId: string; newName: string }) => {
	emit('sectionRenamed', payload);
};

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

const handleUnsortedRowDeleted = (rowId: string) => {
	emit('rowDeleted', {
		rowId,
		sectionId: 'unsorted',
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
	<div :class="classes.gridBody">
		<!-- Unsorted rows area -->
		<div v-if="sortedUnsortedRows.length > 0" :class="classes.unsortedArea">
			<draggable
				:model-value="sortedUnsortedRows"
				:group="enableDragDrop ? 'table-rows' : false"
				:disabled="!enableDragDrop"
				item-key="id"
				:class="classes.unsortedRows"
				@change="onUnsortedDragChange"
			>
				<template #item="{ element: row, index: rowIndex }">
					<div
						:key="row.id"
						:class="classes.gridRow"
						:style="{ gridTemplateColumns }"
					>
						<div
							v-for="(column, cellIndex) in columns"
							:key="`${row.id}-${column.key}`"
							:class="[
								classes.gridCell,
								{
									[classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn,
									[classes.lastCell]: cellIndex === columns.length - 1 && !enableRowActions
								}
							]"
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
						</div>

						<div
							v-if="enableRowActions"
							:class="classes.rowActionsCell"
						>
							<div :class="classes.rowActions">
								<button
									:class="[classes.rowActionBtn, classes.deleteBtn]"
									title="Delete row"
									@click="handleUnsortedRowDeleted(row.id)"
								>
									<span :class="classes.deleteIcon">🗑️</span>
								</button>
							</div>
						</div>
					</div>
				</template>
			</draggable>
		</div>

		<!-- Sections -->
		<generic-grid-section
			v-for="section in sortedSections"
			:key="section.id"
			:section="section"
			:columns="columns"
			:grid-template-columns="gridTemplateColumns"
			:enable-drag-drop="enableDragDrop"
			:sticky-first-column="stickyFirstColumn"
			:enable-row-actions="enableRowActions"
			@section-toggled="handleSectionToggle"
			@section-deleted="handleSectionDelete"
			@section-renamed="handleSectionRename"
			@row-moved="handleRowMoved"
			@row-deleted="handleRowDeleted"
		>
			<template
				v-for="(_column, index) in columns"
				:key="_column.key"
				#[`cell-${index}`]="cellProps"
			>
				<slot
					:name="`cell-${index}`"
					v-bind="cellProps"
				/>
			</template>

			<template #section-header="sectionProps">
				<slot name="section-header" v-bind="sectionProps" />
			</template>
		</generic-grid-section>

		<!-- Add section input -->
		<div
			v-if="showAddSectionInput"
			:class="classes.addSectionInput"
		>
			<input
				ref="addSectionInputRef"
				v-model="newSectionName"
				type="text"
				:class="classes.sectionInput"
				@blur="saveNewSection"
				@keydown.enter="saveNewSection"
				@keydown.esc="cancelAddSection"
			/>
		</div>

		<!-- Add section button -->
		<div
			v-if="props.canAddSections"
			:class="classes.addSectionButton"
			@click="showAddSection"
		>
			<span :class="classes.addIcon">+</span>
			<span>Add section</span>
		</div>
	</div>
</template>

<style module="classes">
.gridBody {
	position: relative;
	display: flex;
	flex-direction: column;
	min-width: fit-content;
	min-height: 0;
	user-select: none;
}

.unsortedArea {
	position: relative;
	min-width: fit-content;
}

.unsortedRows {
	display: flex;
	flex-direction: column;
	min-width: fit-content;
}

.gridRow {
	position: relative;
	display: grid;
	align-items: center;
	min-width: fit-content;
	min-height: 50px;
	border-bottom: 1px solid rgb(255 255 255 / 5%);
	transition: background-color 0.2s ease;
}

.gridRow:hover {
	background-color: var(--border-color-surface-01-effect);
}

.gridRow:hover .gridCell:first-child {
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.gridRow:hover .rowActionsCell {
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
}

.gridRow:hover .lastCell {
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
}

.gridCell {
	position: relative;
	display: flex;
	align-items: center;
	min-width: 0;
	min-height: 50px;
	padding: 8px 12px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	background: var(--bg-color-surface-01);
	border-right: 1px solid rgb(255 255 255 / 5%);
}

.gridCell:last-child {
	border-right: none;
}

.lastCell {
	border-right: none;
}

.stickyFirstCell {
	position: sticky !important;
	left: 0 !important;
	z-index: 10 !important;
	background: var(--bg-color-surface-01) !important;
	border-right: 1px solid rgb(255 255 255 / 5%) !important;
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

.rowActionsCell {
	position: relative;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	min-width: 50px;
	min-height: 50px;
	padding: 8px;
	background: var(--bg-color-surface-01);
}

.rowActions {
	display: flex;
	gap: 4px;
	opacity: 0;
	transition: opacity 0.2s ease;
}

.gridRow:hover .rowActions {
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

.addSectionInput {
	display: flex;
	align-items: center;
	min-width: fit-content;
	padding: 12px 8px;
	font-weight: 440;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	letter-spacing: 0.096px;
}

.sectionInput {
	font-weight: inherit;
	font-size: inherit;
	color: var(--text-color-base-100, #ffffff);
	letter-spacing: inherit;
	background-color: transparent;
	border: none;
	outline: none;
}

.addSectionButton {
	display: flex;
	align-items: center;
	min-width: fit-content;
	padding: 12px 8px;
	font-weight: 440;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
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
