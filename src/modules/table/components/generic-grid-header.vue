<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed, onUnmounted, ref } from 'vue';
import draggable from 'vuedraggable';

import type { IGenericTableColumn, ISortConfig } from '../type';
import { useTableColumns } from '../table-common';
import { useLogger } from '@/shared/service/monitoring';

import GenericColumnSettings from './generic-column-settings.vue';

interface IProps {
	columns: IGenericTableColumn[];
	allColumns: IGenericTableColumn[];
	sortConfig: ISortConfig;
	columnWidths:string[]|undefined;
	enableReordering?: boolean;
	enableResizing?: boolean;
	enableSorting?: boolean;
	enableColumnSettings?: boolean;
	enableRowActions?: boolean;
	sticky?: boolean;
	stickyFirstColumn?: boolean;
}

interface IEmits {
	(e: 'update:columns', columns: IGenericTableColumn[]): void;
	(e: 'update:sort', config: ISortConfig): void;
	(e: 'update:columnWidth', index:number, width:number): void;
}

const props = withDefaults(defineProps<IProps>(), {
	enableReordering: true,
	enableSorting: true,
	enableColumnSettings: false,
	enableRowActions: false,
	sticky: true,
	stickyFirstColumn: true,
});

const emit = defineEmits<IEmits>();

const logger = useLogger();

const { updateColumnPositions } = useTableColumns();

const ignoreDragClass = 'ignoreDrag';

const getSortDirection = (columnKey: string) => {
	return props.sortConfig.columnKey === columnKey ? props.sortConfig.direction : 'none';
};

const getSortIcon = (direction: string) => {
	switch (direction) {
		case 'asc':
			return '↑';
		case 'desc':
			return '↓';
		default:
			return '';
	}
};

const handleColumnReorder = (newColumns: IGenericTableColumn[]) => {
	logger.debug('Column reorder triggered', { context: { newColumns } });

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

// Упрощенная логика для handleMove
const handleMove = (event: uknown) => {
	logger.debug('handleMove called', { context: { event } });

	if (!props.enableReordering) {
		logger.debug('Reordering disabled', { context: { event } });
		return false;
	}

	const { draggedContext, relatedContext } = event;

	// Проверяем, что перетаскиваемый элемент можно перетаскивать
	if (!draggedContext.element.draggable) {
		logger.debug('Element not draggable', { context: { element: draggedContext.element } });
		return false;
	}

	// Получаем индексы
	const draggedIndex = draggedContext.index;
	const targetIndex = relatedContext.index;

	logger.debug(`Moving element from ${draggedIndex} to ${targetIndex}`, { context: { draggedIndex, targetIndex } });

	// Найдем все неперетаскиваемые колонки
	const nonDraggableIndices = props.columns
		.map((col, index) => !col.draggable ? index : -1)
		.filter(index => index !== -1);


	logger.debug('Non-draggable indices', { context: { nonDraggableIndices } });

	// Если нет неперетаскиваемых колонок, разрешаем любое перемещение
	if (nonDraggableIndices.length === 0) {
		return true;
	}

	// Проверяем, не пытаемся ли мы переместить на место неперетаскиваемой колонки
	if (nonDraggableIndices.includes(targetIndex)) {
		logger.debug('Trying to move to non-draggable position', { context: { nonDraggableIndices, targetIndex } });
		return false;
	}

	// Для упрощения, разрешаем перемещение, если не пытаемся занять место неперетаскиваемой колонки
	return true;
};

// Вычисляемое свойство для работы с draggable
const draggableColumns = computed({
	get: () => props.columns,
	set: (value: IGenericTableColumn[]) => {
		handleColumnReorder(value);
	},
});

const resizeStartX = ref<number|null>(null);
const startResizeWidth = ref<number|null>(null);
const resizeIndex = ref<number|null>(null);
const onMouseMove = e=>{
	const dx = e.clientX - resizeStartX.value;
	emit('update:columnWidth', resizeIndex.value, startResizeWidth.value+dx);
};
const onMouseUp = _ =>{
	document.removeEventListener('mousemove', onMouseMove);
	document.removeEventListener('mouseup', onMouseUp);
};
const startResize = (index, e)=> {
	resizeIndex.value = index;
	startResizeWidth.value = parseFloat(props.columnWidths[index]);
	resizeStartX.value = e.clientX;
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
};
onUnmounted(()=>{
	document.removeEventListener('mousemove', onMouseMove);
	document.removeEventListener('mouseup', onMouseUp);
});

</script>

<template>
	<thead
		:class="[classes.tableHeader, { [classes.sticky]: sticky }]"
	>
		<draggable
			v-model="draggableColumns"
			:disabled="!enableReordering||enableResizing"
			:filter="`.${ignoreDragClass}`"
			:move="handleMove"
			:class="classes.headerRow"
			item-key="key"
			tag="tr"
			class="draggable-container headerRowAnchor"
		>
			<template #item="{ element: column, index }">
				<th
					:class="[
						classes.headerCell,
						{
							[ignoreDragClass]: !column.draggable,
							[classes.draggable]: column.draggable && enableReordering,
							[classes.stickyFirstColumn]: index === 0 && stickyFirstColumn,
							[classes.nonDraggable]: !column.draggable,
							[classes.firstColumn]: index === 0
						}
					]"
					:title="column.label"
					:style="{ width: columnWidths?.[index] ?? undefined }"
				>
					<div :class="classes.headerContent">
						<div
							v-if="column.sortable && enableSorting"
							:class="[
								classes.sortArrowContainer,
								ignoreDragClass,
								{
									[classes.sortArrowActive]: getSortDirection(column.key) !== 'none',
									[classes.sortArrowAsc]: getSortDirection(column.key) === 'asc',
									[classes.sortArrowDesc]: getSortDirection(column.key) === 'desc'
								}
							]"
							@click="handleColumnSort(column, $event)"
						>
							<span :class="classes.sortArrow">
								{{ getSortIcon(getSortDirection(column.key)) }}
							</span>
						</div>
						<span
							v-if="enableResizing"
							:class="classes.columnResizer"
							@mousedown="startResize(index,$event)"
						></span>
						<div :class="classes.headerMain">
							<slot
								:name="`header-${index}`"
								:column="column"
								:index="index"
								:sort-direction="getSortDirection(column.key)"
								:sort-icon="getSortIcon(getSortDirection(column.key))"
							>
								<span
									:class="
										classes.headerLabel"
								>
									{{ column.label }}
								</span>
							</slot>
						</div>


					</div>
				</th>
			</template>
			<template #footer>
				<th
					v-if="enableColumnSettings"
					:class="[
						classes.settingsCell,
						ignoreDragClass,
						{
							[classes.sticky]: sticky,
							[classes.stickySettings]: sticky
						}
					]"
					:style="{ width: columnWidths?.[draggableColumns?.length] ?? undefined }"
				>
					<slot name="header-settings">
						<generic-column-settings
							:all-columns="allColumns"
							:visible-columns="columns"
							:hide-first-column="stickyFirstColumn"
							@update:columns="handleColumnSettingsUpdate"
						>
							<template #first-column-settings v-if="$slots['first-column-settings']">
								<slot name="first-column-settings" />
							</template>
						</generic-column-settings>
					</slot>
				</th>
			</template>
		</draggable>


	</thead>
</template>

<style module="classes">
.tableHeader {
	padding: 4px 0;
	background: var(--bg-color-surface-01, #1a1a1a);
	box-shadow: 0 1px 0 0 var(--border-color-surface-02);
}

.tableHeader.sticky {
	position: sticky;
	top: 0;
	z-index: 20;
}

.headerRow {
	height: 28px;
}

.headerCell {
	position: relative;
	padding: 0 12px;
	overflow: hidden;
	font-weight: 440;
	font-size: 12px;
	vertical-align: middle;
	text-align: right;
	color: var(--text-color-base-100, #ffffff);
	white-space: nowrap;
	text-overflow: ellipsis;
	background: var(--bg-color-surface-01, #1a1a1a);
	user-select: none;

	& > div {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.columnResizer {
		position: absolute;
		top: 10%;
		right: 2px;
		display: none;
		width: 3px;
		height: 80%;
		background: #666666;
	}
}

.headerCell.draggable {
	cursor: grab;
}

.headerCell.draggable:active {
	cursor: grabbing;
}

.headerCell.nonDraggable {
	cursor: default;
}

.stickyFirstColumn {
	position: sticky !important;
	left: 0;
	z-index: 1;
	background:
		linear-gradient(
			to right,
			var(--bg-color-surface-01, #1a1a1a) 65%,
			rgb(26 26 26 / 0%) 100%
		);
}

.firstColumn {
	.headerContent {
		justify-content: flex-end;

		.headerMain {
			text-align: left;
		}
	}
}

.headerContent {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	gap: 3px;
	min-width: 0;
	min-height: 28px;

	.headerMain {
		display: block;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-align: right;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}


.headerLabel {
	display: inline-block;
	width: 100%;
	min-width: 0;
	overflow: hidden;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
}


.sortArrow {
	font-size: 12px;
	color: var(--text-color-base-300, #9a9a9d);
	transition: color 0.2s ease;
}

.sortArrowContainer:hover .sortArrow {
	color: var(--text-color-base-100, #ffffff);
}


.sortArrowActive .sortArrow {
	color: var(--text-color-base-100, #ffffff);
}


.settingsCell {
	width: 50px;
	min-width: 50px;
	max-width: 50px;
	padding: 0 12px;
	vertical-align: middle;
	text-align: center;
	background:
		linear-gradient(
			to left,
			var(--bg-color-surface-01, #1a1a1a) 65%,
			rgb(26 26 26 / 0%) 100%
		);
	border: none;
}

.settingsCell.sticky {
	position: sticky;
	right: 0;
	z-index: 21;
}

.draggable-container {
	display: contents;
}


</style>
