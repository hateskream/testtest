<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, computed, nextTick } from 'vue';
import draggable from 'vuedraggable';

import type {
	IGenericTableSection,
	IGenericTableColumn,
	ISortConfig,
	IDragDropEvent,
	IDragEvent,
} from '../type';
import { useTableData, useTableLayout } from '../table-common';

export interface ITableItem<T> {
	id: string;
	type: 'section-header' | 'row' | 'section-placeholder';
	section?: IGenericTableSection<T>;
	row?: T;
	sectionId?: string;
}

export interface IProps<T> {
	sections: IGenericTableSection<T>[];
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
const { getColumnStyles, getTotalColumnSpan } = useTableLayout();

const hoveredRowId = ref<string | null>(null);
const isDragging = ref<boolean>(false);

const showAddSectionInput = ref(false);
const addSectionInputRef = ref<HTMLInputElement>();
const newSectionName = ref('New section');

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

const hasActionsOrSettings = computed(() => props.enableRowActions || props.enableColumnSettings);

const shouldUseColspan = computed(() => props.enableColumnSettings && !props.enableRowActions);

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

const flattenedItems = computed((): ITableItem<T>[] => {
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

const handleSectionToggle = (sectionId: string) => {
	emit('sectionToggled', sectionId);
};

// const handleRowDeleted = (rowId: string, sectionId: string) => {
// 	emit('rowDeleted', { rowId, sectionId });
// };

const onUnifiedDragChange = (evt: IDragEvent<ITableItem<T>>) => {
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

const canMoveItem = (evt: unknown) => {
	if (evt?.draggedContext?.element) {
		const draggedItem = evt.draggedContext.element;
		return draggedItem.type === 'row';
	} else {
		return false;
	}
};
</script>

<template generic="T">
	<draggable
		:model-value="flattenedItems"
		:group="enableDragDrop ? 'unified-table' : false"
		:disabled="!enableDragDrop"
		item-key="id"
		tag="tbody"
		:class="[classes.tableBody, { [classes.dragging]: isDragging }]"
		:style="columnStyles"
		:move="canMoveItem"
		@change="onUnifiedDragChange"
		@start="handleDragStart"
		@end="handleDragEnd"
	>
		<template #item="{ element: item }">
			<tr
				:key="item.id"
				:class="[
					{
						[classes.sectionHeaderRow]: item.type === 'section-header',
						[classes.tableRow]: item.type === 'row',
						[classes.tableRowHovered]: item.type === 'row' && hoveredRowId === item.row?.id
					}
				]"
				@click="item.type === 'section-header' ? handleSectionToggle(item.section!.id) : undefined"
				@mouseenter="item.type === 'row' && item.row ? handleRowMouseEnter(item.row.id) : undefined"
				@mouseleave="item.type === 'row' ? handleRowMouseLeave() : undefined"
			>
				<td
					v-if="item.type === 'section-header'"
					:class="classes.sectionHeader"
					:colspan="totalColumnSpan"
				>
					<div :class="classes.sectionHeaderContent">
						<div :class="classes.sectionToggle">
							<span :class="[classes.toggleIcon, { [classes.collapsed]: item.section!.isCollapsed }]">
								▼
							</span>
						</div>
						<div :class="classes.sectionTitle">
							<slot name="section-header" :section="item.section!">
								{{ item.section!.title }} ({{ item.section!.rows?.length || 0 }} rows)
							</slot>
						</div>
						<div :class="classes.sectionActions">
							<slot name="section-actions" :section="item.section!" />
						</div>
					</div>
				</td>

				<template v-else-if="item.type === 'row'">
					<td
						v-for="(column, cellIndex) in columns"
						:key="`${item.row!.id}-${column.key}`"
						:colspan="shouldUseColspan && cellIndex + 1 === columns.length ? 2 : 1"
						:class="[
							classes.tableCell,
							{
								[classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn,
								[classes.stickyFirstCellHovered]: cellIndex === 0
									&& stickyFirstColumn && hoveredRowId === item.row!.id,
							}
						]"
						:style="{
							...(cellIndex !== 0 ? {width: `var(--col-${cellIndex}-width)`} : {}),
							minWidth: `var(--col-${cellIndex}-min-width)`
						}"
					>
						<slot
							:name="`cell-${cellIndex}`"
							:row="item.row!"
							:column="column"
							:cell-index="cellIndex"
							:value="item.row!.data[column.key]"
						>
							{{item?.row.data[column.key] }}
						</slot>
					</td>

					<td
						v-if="enableRowActions"
						:class="[
							classes.rowActions,
							classes.tableCell,
							{ [classes.rowActionsHovered]: hoveredRowId === item.row!.id }
						]"
					>
						<slot
							name="row-actions"
							:row="item.row!"
							:section-id="item.sectionId!"
						/>
					</td>
				</template>

				<td
					v-else-if="item.type === 'section-placeholder'"
					:colspan="totalColumnSpan"
					:class="classes.emptyDropZoneCell"
				>
					<div :class="classes.emptyDropZoneContent">
						<span :class="classes.emptyDropZoneText">
							Drop items here or section is empty
						</span>
					</div>
				</td>
			</tr>
		</template>

		<template #ghost="{ element: item }">
			<tr v-if="item.type === 'row'" :class="classes.ghostRow">
				<td
					v-for="(column, cellIndex) in columns"
					:key="`ghost-${item.row!.id}-${column.key}`"
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
					{{
						item.row!.data[column.key] || 'N/A'
					}}
				</td>

			</tr>
		</template>

		<template #footer>
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
	background: var(--bg-color-surface-02-effect, #333333);
}

.sectionHeaderContent {
	display: flex;
	align-items: center;
	width: 100%;
	min-height: 44px;
	padding: 0 12px;
	transition: all 0.2s ease;
}

.sectionToggle {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	margin-right: 8px;
}

.toggleIcon {
	font-size: 12px;
	color: var(--text-color-base-300, #cccccc);
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

.columnSettingsHovered {
	background:
		linear-gradient(
			to left,
			rgb(32 32 32 / 100%) 65%,
			rgb(32 32 32 / 0%) 100%
		);
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
