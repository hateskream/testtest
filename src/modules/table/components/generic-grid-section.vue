<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed, ref } from 'vue';
import draggable from 'vuedraggable';

import type {
	IGenericTableSection,
	IGenericTableColumn,
	IDragDropEvent,
	IDragEvent,
} from '../type';
import { useTableDragDrop } from '../composables/use-table-data.ts';

export interface IProps<T> {
	section: IGenericTableSection<T>;
	columns: IGenericTableColumn[];
	gridTemplateColumns: string;
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
}

export interface IEmits<T> {
	(e: 'sectionToggled', sectionId: string): void;

	(e: 'sectionDeleted', sectionId: string): void;

	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;

	(e: 'rowMoved', payload: IDragDropEvent<T>): void;

	(e: 'rowDeleted', payload: { rowId: string; sectionId: string }): void;
}

const props = withDefaults(defineProps<IProps<T>>(), {
	enableDragDrop: true,
	stickyFirstColumn: true,
	enableRowActions: true,
});

const emit = defineEmits<IEmits<T>>();

const { handleDragChange } = useTableDragDrop();

// Track which row is currently being hovered
const hoveredRowId = ref<string | null>(null);

// Hover handlers for individual rows
const handleRowMouseEnter = (rowId: string) => {
	hoveredRowId.value = rowId;
};

const handleRowMouseLeave = () => {
	hoveredRowId.value = null;
};

const isExpanded = computed(() => !props.section.isCollapsed);

const handleSectionToggle = () => {
	emit('sectionToggled', props.section.id);
};

const handleSectionDelete = () => {
	emit('sectionDeleted', props.section.id);
};

// const handleSectionRename = (newName: string) => {
// 	emit('sectionRenamed', {
// 		sectionId: props.section.id,
// 		newName,
// 	});
// };

const handleRowDeleted = (rowId: string) => {
	emit('rowDeleted', {
		rowId,
		sectionId: props.section.id,
	});
};

const onDragChange = (evt: IDragEvent<T>) => {
	handleDragChange(
		evt,
		props.section.id,
		(sectionId: string, oldIndex: number, newIndex: number) => {
			emit('rowMoved', {
				type: 'moved',
				sectionId,
				oldIndex,
				newIndex,
			});
		},
		(evtTransfer: IDragEvent<T>) => {
			if (evtTransfer.added) {
				emit('rowMoved', {
					type: 'added',
					sectionId: props.section.id,
					newIndex: evtTransfer.added.newIndex,
					element: evtTransfer.added.element,
				});
			}
			if (evt.removed) {
				emit('rowMoved', {
					type: 'removed',
					sectionId: props.section.id,
					oldIndex: evt.removed.oldIndex,
					element: evt.removed.element,
				});
			}
		},
	);
};
</script>

<template generic="T">
	<div :class="classes.section">
		<!-- Section Header -->
		<div :class="classes.sectionHeader">
			<!-- Sticky left section with toggle and title -->
			<div
				:class="classes.sectionHeaderLeft"
				@click="handleSectionToggle"
			>
				<div :class="classes.sectionToggle">
					<span :class="[classes.toggleIcon, { [classes.collapsed]: !isExpanded }]">
						▼
					</span>
				</div>
				<div :class="classes.sectionTitle">
					<slot name="section-header" :section="section">
						{{ section.title }}
					</slot>
				</div>
			</div>

			<!-- Spacer to fill the middle area -->
			<div :class="classes.sectionHeaderSpacer" />

			<!-- Sticky right section with actions -->
			<div :class="classes.sectionHeaderRight">
				<div :class="classes.sectionActions">
					<button
						:class="[classes.sectionActionBtn, classes.deleteBtn]"
						title="Delete section"
						@click.stop="handleSectionDelete"
					>
						<span :class="classes.deleteIcon">🗑</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Section Rows -->
		<div
			v-if="isExpanded"
			:class="classes.sectionRows"
		>
			<draggable
				:model-value="section.rows"
				:group="enableDragDrop ? 'table-rows' : false"
				:disabled="!enableDragDrop"
				item-key="id"
				:class="classes.draggableRows"
				@change="onDragChange"
			>
				<template #item="{ element: row, index: rowIndex }">
					<div
						:key="row.id"
						:class="[classes.gridRow, { [classes.gridRowHovered]: hoveredRowId === row.id }]"
						:style="{ gridTemplateColumns }"
						@mouseenter="handleRowMouseEnter(row.id)"
						@mouseleave="handleRowMouseLeave"
					>
						<div
							v-for="(column, cellIndex) in columns"
							:key="`${row.id}-${column.key}`"
							:class="[
								classes.gridCell,
								{
									[classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn,
									[classes.stickyFirstCellHovered]: cellIndex === 0
										&& stickyFirstColumn && hoveredRowId === row.id,
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
									@click="handleRowDeleted(row.id)"
								>
									<span :class="classes.deleteIcon">🗑️</span>
								</button>
							</div>
						</div>
					</div>
				</template>
			</draggable>
		</div>
	</div>
</template>

<style module="classes">
.section {
	position: relative;
	display: flex;
	flex-direction: column;
	min-width: fit-content;
}

.sectionHeader {
	position: relative;
	display: flex;
	align-items: center;
	min-width: fit-content;
	min-height: 44px;
	background: var(--bg-color-surface-02, #2a2a2a);
	border-bottom: 1px solid rgb(255 255 255 / 10%);
	user-select: none;
}

.sectionHeader:hover {
	background: var(--bg-color-surface-02-hover, #333333);
}

.sectionHeaderLeft {
	position: sticky;
	left: 0;
	z-index: 15;
	display: flex;
	flex-shrink: 0;
	align-items: center;
	min-width: 0;
	padding: 0 12px;
	background: inherit;
	cursor: pointer;
}

.sectionHeaderSpacer {
	flex: 1;
	min-width: 0;
}

.sectionHeaderRight {
	position: sticky;
	right: 0;
	z-index: 15;
	display: flex;
	flex-shrink: 0;
	align-items: center;
	padding: 0 12px;
	background: inherit;
}

.sectionHeaderRight::before {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: -1px;
	z-index: 1;
	width: 1px;
	background: rgb(255 255 255 / 10%);
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
	opacity: 1;
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

.sectionRows {
	position: relative;
	min-width: fit-content;
}

.draggableRows {
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
}

.gridRowHovered {
	background-color: var(--border-color-surface-01-effect);
}

.gridRowHovered .gridCell:first-child {
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.gridRowHovered .rowActionsCell {
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
}

.gridRowHovered .lastCell {
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
	background: transparent;
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
	background: transparent !important;
	border-right: 1px solid rgb(255 255 255 / 5%) !important;
}

.stickyFirstCellHovered {
	background: rgb(32 32 32 / 100%) !important;
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
	background: transparent;
}

.rowActions {
	display: flex;
	gap: 4px;
	opacity: 0;
	transition: opacity 0.2s ease;
}

.gridRowHovered .rowActions {
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
</style>
