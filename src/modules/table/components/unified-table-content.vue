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
import { useTableData, useTableLayout } from '../table-common';

export interface ITableItem<T> {
	id: string;
	type: 'section-header' | 'row' | 'section-placeholder';
	section?: IGenericTableSection<T>;
	row?: IGenericTableRow<T>;
	sectionId?: string;
}

export interface IProps<T> {
	// Data sources (one will be used based on mode)
	sections?: IGenericTableSection<T>[];
	rows?: IGenericTableRow<T>[];
	isFixedWidth?: boolean;

	// Common props
	columns: IGenericTableColumn[];
	sortConfig: ISortConfig;
	containerWidth?: number;

	// Feature flags
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
	enableColumnSettings?: boolean;

	// Sectioned mode specific
	canAddSections?: boolean;
}

export interface IEmits<T> {
	(e: 'update:sections', sections: IGenericTableSection<T>[]): void;
	(e: 'update:rows', rows: IGenericTableRow<T>[]): void;
	(e: 'rowMoved', payload: IDragDropEvent<T>): void;
	(e: 'rowDeleted', payload: { rowId: string; sectionId?: string }): void;
	(e: 'sectionToggled', sectionId: string): void;
	(e: 'sectionAdded', sectionName: string): void;
	(e: 'sectionDeleted', sectionId: string): void;
	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;
	(e: 'click-on-row', tickerId: string): void;
}

const props = withDefaults(defineProps<IProps<T>>(), {
	sections: () => [],
	rows: () => [],
	enableDragDrop: true,
	stickyFirstColumn: true,
	enableRowActions: true,
	enableColumnSettings: false,
	canAddSections: false,
	isFixedWidth: false,
});

const emit = defineEmits<IEmits<T>>();

const { sortData } = useTableData();
const { getColumnStyles, getTotalColumnSpan } = useTableLayout();

// State
const hoveredRowId = ref<string | null>(null);
const isDragging = ref<boolean>(false);
const showAddSectionInput = ref(false);
const addSectionInputRef = ref<HTMLInputElement>();
const newSectionName = ref('New section');

// Determine table mode
const isSectioned = computed(() => {
	return props.sections && props.sections.length > 0;
});

// Common computed properties
const hasActionsOrSettings = computed(() => props.enableRowActions || props.enableColumnSettings);

const shouldUseColspan = computed(() => props.enableColumnSettings && !props.enableRowActions);

const columnStyles = computed(() => {
	return getColumnStyles(props.columns);
});

const totalColumnSpan = computed(() => {
	return getTotalColumnSpan(props.columns.length, hasActionsOrSettings.value);
});

const dragGroup = computed(() => {
	return isSectioned.value ? 'unified-table' : 'table-rows';
});

// Sort sections (for sectioned mode)
const sortedSections = computed(() => {
	if (!isSectioned.value) {
		return [];
	}

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

// Sort rows (for unsectioned mode)
const sortedRows = computed(() => {
	if (isSectioned.value) {
		return [];
	}

	if (!props.sortConfig || props.sortConfig.direction === 'none' || !props.sortConfig.columnKey) {
		return props.rows;
	}

	const sortColumn = props.columns.find(col => col.key === props.sortConfig.columnKey);
	if (!sortColumn) {
		return props.rows;
	}

	return sortData(props.rows, sortColumn, props.sortConfig.direction);
});

// Flatten sections into items (for sectioned mode)
const flattenedItems = computed((): ITableItem<T>[] => {
	if (!isSectioned.value) {
		return [];
	}

	const items: ITableItem<T>[] = [];

	sortedSections.value.forEach(section => {
		items.push({
			id: `section-header-${section.id}`,
			type: 'section-header',
			section: section,
		});

		if (!section.isCollapsed && section.rows && section.rows.length > 0) {
			section.rows.forEach(row => {
				items.push({
					id: row.id,
					type: 'row',
					row: row,
					sectionId: section.id,
				});
			});
		} else if (!section.isCollapsed) {
			items.push({
				id: `placeholder-${section.id}`,
				type: 'section-placeholder',
				section: section,
			});
		}
	});

	return items;
});

// Unified table items (works for both modes)
const tableItems = computed({
	get: () => {
		if (isSectioned.value) {
			return flattenedItems.value;
		}
		return sortedRows.value;
	},
	set: (value) => {
		// This setter is used by draggable v-model
		// The actual updates happen through drag events
	},
});

// Helper to get row ID from item
const getRowId = (item: ITableItem<T> | IGenericTableRow<T>): string => {
	if ('type' in item && item.type === 'row') {
		return item.row?.id || '';
	}
	return item.id || '';
};

// Helper to get actual row from item
const getRow = (item: ITableItem<T> | IGenericTableRow<T>): IGenericTableRow<T> | undefined => {
	if ('type' in item) {
		return item.row;
	}
	return item as IGenericTableRow<T>;
};

// Mouse handlers
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

// Unified drag change handler


// Sectioned drag handler
const handleSectionedDragChange = (evt: IDragEvent<ITableItem<T>>) => {
	if (evt.moved) {
		const movedItem = evt.moved.element;

		if (movedItem.type === 'row') {
			const { newIndex } = evt.moved;
			const { oldIndex } = evt.moved;
			const currentItems = flattenedItems.value;
			const targetItem = currentItems[newIndex];
			let targetSectionId = movedItem.sectionId;
			let sectionRowIndex = 0;

			if (targetItem && targetItem.type === 'section-header') {
				targetSectionId = targetItem.section!.id;
				sectionRowIndex = 0;
			} else {
				for (let i = newIndex - 1; i >= 0; i -= 1) {
					const item = currentItems[i];
					if (item.type === 'section-header') {
						targetSectionId = item.section!.id;
						break;
					}
				}

				for (let i = 0; i < newIndex; i += 1) {
					const item = currentItems[i];
					if (item.type === 'row' && item.sectionId === targetSectionId) {
						sectionRowIndex += 1;
					}
				}
			}

			let oldSectionRowIndex = 0;
			if (targetSectionId === movedItem.sectionId) {
				for (let i = 0; i < oldIndex; i += 1) {
					const item = currentItems[i];
					if (item.type === 'row' && item.sectionId === movedItem.sectionId) {
						oldSectionRowIndex += 1;
					}
				}

				if (oldIndex < newIndex && (!targetItem || targetItem.type !== 'section-header')) {
					sectionRowIndex -= 1;
				}

				emit('rowMoved', {
					type: 'moved',
					sectionId: targetSectionId,
					oldIndex: oldSectionRowIndex,
					newIndex: sectionRowIndex,
				});
			} else {
				oldSectionRowIndex = 0;
				for (let i = 0; i < oldIndex; i += 1) {
					const item = currentItems[i];
					if (item.type === 'row' && item.sectionId === movedItem.sectionId) {
						oldSectionRowIndex += 1;
					}
				}

				emit('rowMoved', {
					type: 'removed',
					sectionId: movedItem.sectionId!,
					oldIndex: oldSectionRowIndex,
					element: movedItem.row,
				});

				emit('rowMoved', {
					type: 'added',
					sectionId: targetSectionId,
					newIndex: sectionRowIndex,
					element: movedItem.row,
				});
			}
		}
	}
};

// Unsectioned drag handler
const handleUnsectionedDragChange = (evt: IDragEvent<IGenericTableRow<T>>) => {
	if (evt.moved) {
		emit('rowMoved', {
			type: 'moved',
			sectionId: 'unsorted',
			oldIndex: evt.moved.oldIndex,
			newIndex: evt.moved.newIndex,
		});
	}

	if (evt.added) {
		emit('rowMoved', {
			type: 'added',
			sectionId: 'unsorted',
			newIndex: evt.added.newIndex,
			element: evt.added.element,
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
};


// Common drag handler
const handleUnifiedDragChange = (evt: IDragEvent<ITableItem<T> | IGenericTableRow<T>>) => {
	if (isSectioned.value) {
		handleSectionedDragChange(evt as IDragEvent<ITableItem<T>>);
	} else {
		handleUnsectionedDragChange(evt as IDragEvent<IGenericTableRow<T>>);
	}
};
// Can move item validation
const canMoveItem = (evt: unknown) => {
	if (isSectioned.value) {
		if (evt?.draggedContext?.element) {
			const draggedItem = evt.draggedContext.element;
			return draggedItem.type === 'row';
		}
		return false;
	}
	return true; // In unsectioned mode, all items can move
};

// Section handlers (only for sectioned mode)
const handleSectionToggle = (sectionId: string) => {
	emit('sectionToggled', sectionId);
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

const calculateStyles = (index: number, columnsPayload: IGenericTableColumn[]) => {
	if (props.isFixedWidth) {
		if (index === 0) {
			return { width: '100%' };
		} else {
			return { width: '50%' };
		}
	}

	return {
		...(index !== 0 ?
			{ width:
					`calc(var(--col-${index}-width)
					${shouldUseColspan.value && index + 1 === columnsPayload.length ? 70 : 0}px)` } : {}),

		minWidth:
			`calc(var(--col-${index}-min-width) +
			${shouldUseColspan.value && index + 1 === columnsPayload.length ? 70 : 0}px)`,
	};

};

</script>

<template>
	<draggable
		v-model="tableItems"
		:group="enableDragDrop ? dragGroup : false"
		:disabled="!enableDragDrop"
		item-key="id"
		tag="tbody"
		:class="[classes.tableBody, { [classes.dragging]: isDragging }]"
		:style="isSectioned ? columnStyles : undefined"
		:move="canMoveItem"
		@change="handleUnifiedDragChange"
		@start="handleDragStart"
		@end="handleDragEnd"
	>
		<template #item="{ element: item, index: itemIndex }">
			<tr
				:class="[
					{
						[classes.sectionHeaderRow]: isSectioned && item.type === 'section-header',
						[classes.tableRow]: !isSectioned || item.type === 'row',
						[classes.tableRowHovered]:
							(!isSectioned || item.type === 'row') && hoveredRowId === getRowId(item)
					}
				]"
				@click="isSectioned && item.type === 'section-header'
					? handleSectionToggle(item.section!.id) : emit('click-on-row', getRowId(item))"
				@mouseenter="(!isSectioned || item.type === 'row') && handleRowMouseEnter(getRowId(item))"
				@mouseleave="(!isSectioned || item.type === 'row') && handleRowMouseLeave()"
			>
				<!-- SECTION HEADER CONTENT -->
				<td
					v-if="isSectioned && item.type === 'section-header'"
					:class="classes.sectionHeader"
					:colspan="totalColumnSpan"
				>
					<div :class="classes.sectionHeaderContent">
						<div :class="classes.sectionHeaderLeft">
							<div :class="classes.sectionToggle">
								<span :class="[classes.toggleIcon, { [classes.collapsed]: item.section!.isCollapsed }]">
									⌄
								</span>
							</div>
							<div :class="classes.sectionTitle">
								<slot name="section-header" :section="item.section!">
									{{ item.section!.title }} ({{ item.section!.rows?.length || 0 }} rows)
								</slot>
							</div>
						</div>
						<div :class="classes.sectionHeaderRight" @click.stop>
							<slot name="section-actions" :section-id="item.section!.id" />
						</div>
					</div>
				</td>

				<!-- SECTION PLACEHOLDER CONTENT -->
				<td
					v-else-if="isSectioned && item.type === 'section-placeholder'"
					:colspan="totalColumnSpan"
					:class="classes.emptyDropZoneCell"
				>
					<div :class="classes.emptyDropZoneContent">
						<span :class="classes.emptyDropZoneText">
							Drop items here or section is empty
						</span>
					</div>
				</td>

				<!-- ROW CONTENT (works for both modes) -->
				<template v-else>
					<td
						v-for="(column, cellIndex) in columns"
						:key="`${getRowId(item)}-${column.key}`"
						:colspan="shouldUseColspan && cellIndex + 1 === columns.length ? 2 : 1"
						:class="[
							classes.tableCell,
							{
								[classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn,
								[classes.stickyFirstCellHovered]: cellIndex === 0
									&& stickyFirstColumn && hoveredRowId === getRowId(item),
							}
						]"
						:style="calculateStyles(cellIndex, columns)"
					>
						<slot
							:name="`cell-${cellIndex}`"
							:row="getRow(item)!"
							:column="column"
							:cell-index="cellIndex"
							:row-index="itemIndex"
							:value="getRow(item)!.data[column.key]"
						>
							{{ getRow(item)?.data[column.key] }}
						</slot>
					</td>

					<td
						v-if="enableRowActions"
						:class="[
							classes.rowActions,
							classes.tableCell,
							{ [classes.rowActionsHovered]: hoveredRowId === getRowId(item) }
						]"
					>
						<slot
							name="row-actions"
							:ticker-id="getRowId(item)"
							:section-id="isSectioned && item.type === 'row' ? item.sectionId : undefined"
						/>
					</td>
				</template>
			</tr>
		</template>

		<template #ghost="{ element: item }">
			<tr
				v-if="!isSectioned || (isSectioned && item.type === 'row')"
				:class="classes.ghostRow"
			>
				<td
					v-for="(column, cellIndex) in columns"
					:key="`ghost-${getRowId(item)}-${column.key}`"
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
					{{ getRow(item)?.data[column.key] || 'N/A' }}
				</td>
			</tr>
		</template>

		<template #footer>
			<!-- Add section input (sectioned mode only) -->
			<tr v-if="isSectioned && showAddSectionInput" :class="classes.addSectionRow">
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

			<!-- Add section button (sectioned mode only) -->
			<tr v-if="isSectioned && props.canAddSections" :class="classes.addSectionRow">
				<td
					:colspan="totalColumnSpan"
					:class="classes.addSectionButton"
					@click="showAddSection"
				>
					<span :class="classes.addIcon">+</span>
					<span>Add section</span>
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

.tableRow {
	height: 40px;
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
	padding: 8px 10px;
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

/* Section styles */
.sectionHeaderRow {
	cursor: pointer;
}

.sectionHeader {
	padding: 0;
	background: transparent;
	border: none;
	cursor: pointer;
	transition: background-color 0.2s ease;
	user-select: none;
}

.sectionHeader:hover {
	background: var(--bg-color-surface-02-effect, #333333);

	.sectionHeaderRight {
		opacity: 1;
	}
}

.sectionHeaderContent {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	min-height: 44px;
	padding: 0 12px;
	transition: all 0.2s ease;
}

.sectionHeaderLeft {
	position: sticky;
	top: 0;
	left: 0;
	display: flex;
	flex: 0 0 auto;
	align-items: center;
	min-width: 0;
}

.sectionHeaderRight {
	position: sticky;
	top: 0;
	right: 0;
	display: flex;
	flex-shrink: 0;
	align-items: center;
	opacity: 0;
	gap: 4px;
}

.sectionToggle {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	margin-right: 8px;
}

.toggleIcon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 12px;
	height: 12px;
	font-size: 12px;
	color: var(--text-color-base-300, #cccccc);
	transform: translateY(-2px);
	transition: transform 0.2s ease;
}

.toggleIcon.collapsed {
	transform: translateX(-2px) rotate(-90deg);
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

/* Row actions */
.rowActions {
	position: sticky;
	height:100%;
	right: 0;
	top: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 70px;
	min-width: 50px;
	opacity: 0;
}

.rowActionsHovered {
	background:
		linear-gradient(
			to left,
			rgb(32 32 32 / 100%) 65%,
			rgb(32 32 32 / 0%) 100%
		);
}

.columnSettings {
	position: sticky;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;
}

/* Add section styles */
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

/* Ghost and placeholder styles */
.ghostRow {
	background: var(--border-color-surface-01-effect) !important;
	border: 2px dashed rgb(59 130 246 / 50%) !important;
	opacity: 0.7 !important;
}

.ghostCell {
	color: var(--text-color-base-300) !important;
	background: transparent !important;
	border: none !important;
}

.emptyDropZoneCell {
	position: relative;
	min-height: 60px;
	padding: 20px 12px;
	vertical-align: middle;
	text-align: center;
	background: transparent;
	border: none;
}

.emptyDropZoneContent {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 40px;
	border: 2px dashed rgb(255 255 255 / 10%);
	border-radius: 8px;
	transition: all 0.3s ease;
}

.emptyDropZoneContent:hover {
	background: rgb(59 130 246 / 5%);
	border-color: rgb(59 130 246 / 50%);
}

.emptyDropZoneText {
	font-style: italic;
	font-size: 14px;
	color: var(--text-color-base-300, #9a9a9d);
}
</style>
