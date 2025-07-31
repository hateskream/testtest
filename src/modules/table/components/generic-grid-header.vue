<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import draggableComponent from 'vuedraggable';

import type { IGenericTableColumn, ISortConfig } from '../type';
import { useTableColumns } from '../composables/use-table-data.ts';

import GenericColumnSettings from './generic-column-settings.vue';

interface IProps {
	columns: IGenericTableColumn[];
	allColumns: IGenericTableColumn[];
	sortConfig: ISortConfig;
	gridTemplateColumns: string;
	enableReordering?: boolean;
	enableSorting?: boolean;
	enableSettings?: boolean;
	sticky?: boolean;
	stickyFirstColumn?: boolean;
}

interface IEmits {
	(e: 'update:columns', columns: IGenericTableColumn[]): void;
	(e: 'update:sort', config: ISortConfig): void;
}

const props = withDefaults(defineProps<IProps>(), {
	enableReordering: true,
	enableSorting: true,
	enableSettings: true,
	sticky: true,
	stickyFirstColumn: true,
});

const emit = defineEmits<IEmits>();

const { updateColumnPositions } = useTableColumns();

const ignoreDragClass = 'ignoreDrag';

const getSortDirection = (columnKey: string) => {
	return props.sortConfig.columnKey === columnKey ? props.sortConfig.direction : 'none';
};

const getSortIcon = (direction: string) => {
	switch (direction) {
		case 'asc': return '↑';
		case 'desc': return '↓';
		default: return '↕';
	}
};

const handleColumnReorder = (newColumns: IGenericTableColumn[]) => {
	const updatedColumns = updateColumnPositions(newColumns);
	emit('update:columns', updatedColumns);
};

const handleColumnSort = (column: IGenericTableColumn, event: Event) => {
	if (!props.enableSorting || !column.sortable) {
		return;
	}

	event.stopPropagation();
	event.preventDefault();

	const currentDirection = getSortDirection(column.key);
	let newDirection: 'asc' | 'desc' | 'none' = 'asc';

	if (currentDirection === 'asc') {
		newDirection = 'desc';
	} else if (currentDirection === 'desc') {
		newDirection = 'none';
	}

	const newSortConfig = {
		columnKey: newDirection === 'none' ? '' : column.key,
		direction: newDirection,
	};

	emit('update:sort', newSortConfig);
};

const handleColumnSettingsUpdate = (updatedColumns: IGenericTableColumn[]) => {
	emit('update:columns', updatedColumns);
};

// Completely prevent any move that would displace non-draggable columns
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMove = (event: any) => {
	if (!props.enableReordering) {
		return false;
	}

	const { draggedContext, relatedContext } = event;

	// Don't allow dragging non-draggable columns
	if (!draggedContext.element.draggable) {
		return false;
	}

	const draggedIndex = draggedContext.index;
	const targetIndex = relatedContext.index;

	// Find all non-draggable column indices
	const nonDraggableIndices = props.columns
		.map((col, index) => !col.draggable ? index : -1)
		.filter(index => index !== -1);

	// If there are no non-draggable columns, allow any move
	if (nonDraggableIndices.length === 0) {
		return true;
	}

	// For each non-draggable column, check if this move would affect its position
	for (const nonDraggableIndex of nonDraggableIndices) {
		// Case 1: Trying to move an item to a non-draggable column's position
		if (targetIndex === nonDraggableIndex) {
			return false;
		}

		// Case 2: Moving from left to right past a non-draggable column
		if (draggedIndex < nonDraggableIndex && targetIndex >= nonDraggableIndex) {
			return false;
		}

		// Case 3: Moving from right to left past a non-draggable column
		if (draggedIndex > nonDraggableIndex && targetIndex <= nonDraggableIndex) {
			return false;
		}
	}

	return true;
};

</script>

<template>
	<div
		class="grid-header"
		:class="{ sticky: sticky }"
	>
		<draggable-component
			:model-value="columns"
			item-key="position"
			:disabled="!enableReordering"
			:filter="`.${ignoreDragClass}`"
			class="contents"
			:style="{ gridTemplateColumns }"
			@update:model-value="handleColumnReorder"
			@move="handleMove"
		>
			<template #item="{ element: column, index }">
				<div
					class="header-cell"
					:class="{
						[ignoreDragClass]: !column.draggable,
						draggable: column.draggable && enableReordering,
						'sticky-first-column': index === 0 && stickyFirstColumn,
						'non-draggable': !column.draggable
					}"
					:title="column.label"
				>
					<div class="header-content">
						<div class="header-main">
							<slot
								:name="`header-${index}`"
								:column="column"
								:index="index"
								:sort-direction="getSortDirection(column.key)"
								:sort-icon="getSortIcon(getSortDirection(column.key))"
							>
								<span class="header-label">
									{{ column.label }}
								</span>
							</slot>
						</div>

						<div
							v-if="column.sortable && enableSorting"
							class="sort-arrow-container ignoreDrag"
							:class="{
								'sort-arrow-active': getSortDirection(column.key) !== 'none',
								'sort-arrow-asc': getSortDirection(column.key) === 'asc',
								'sort-arrow-desc': getSortDirection(column.key) === 'desc'
							}"
							@click="handleColumnSort(column, $event)"
						>
							<span class="sort-arrow">
								{{ getSortIcon(getSortDirection(column.key)) }}
							</span>
						</div>
					</div>
				</div>
			</template>
		</draggable-component>

		<div
			v-if="enableSettings"
			class="settings-cell"
			:class="{ sticky: sticky }"
		>
			<slot name="header-settings">
				<generic-column-settings
					:all-columns="allColumns"
					:visible-columns="columns"
					@update:columns="handleColumnSettingsUpdate"
				/>
			</slot>
		</div>
	</div>
</template>

<style scoped>
.grid-header {
	display: flex;
	align-items: stretch;
	min-width: fit-content;
	min-height: 44px;
	background: var(--bg-color-surface-01, #1a1a1a);
	border-bottom: 1px solid var(--border-color-base-300, #444444);
	gap: 0;
}

.grid-header.sticky {
	position: sticky;
	top: 0;
	z-index: 20;
}

.contents {
	display: grid;
	flex: 1;
	align-items: center;
}

.header-cell {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 0;
	height: 44px;
	padding: 0 12px;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-100, #ffffff);
	white-space: nowrap;
	border-right: 1px solid var(--border-color-base-300, #444444);
	user-select: none;
}

.header-cell.draggable {
	cursor: grab;
}

.header-cell.draggable:active {
	cursor: grabbing;
}

.header-cell.non-draggable {
	position: relative;
	cursor: default;
	opacity: 0.7;
}

.header-cell.non-draggable::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgb(255 255 255 / 5%);
	pointer-events: none;
}

.sticky-first-column {
	position: sticky !important;
	left: 0;
	z-index: 21;
	background: var(--bg-color-surface-01, #1a1a1a);
}

.header-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	gap: 8px;
	min-width: 0;
}

.header-main {
	display: block;
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.header-label {
	display: inline-block;
	width: 100%;
	min-width: 0;
	overflow: hidden;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.sort-arrow-container {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	background: transparent;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.sort-arrow-container:hover {
	background: rgb(255 255 255 / 10%);
}

.sort-arrow {
	font-size: 12px;
	color: var(--text-color-base-300, #9a9a9d);
	transition: color 0.2s ease;
}

.sort-arrow-container:hover .sort-arrow {
	color: var(--text-color-base-100, #ffffff);
}

.sort-arrow-active {
	background: rgb(255 255 255 / 5%);
}

.sort-arrow-active .sort-arrow {
	color: var(--text-color-base-100, #ffffff);
}

.sort-arrow-asc .sort-arrow {
	color: #00d4aa;
}

.sort-arrow-desc .sort-arrow {
	color: #ff6b6b;
}

.settings-cell {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 50px;
	height: 44px;
	padding: 0 12px;
	background: var(--bg-color-surface-01, #1a1a1a);
}

.settings-cell.sticky {
	position: sticky;
	right: 0;
	z-index: 21;
}
</style>
