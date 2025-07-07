<script setup lang="ts">
import draggable from 'vuedraggable';

import type {
	IGenericTableColumn,
	IGenericTableRow,
	IDragDropEvent,
	IDragEvent,
} from '../type';
import { useTableDragDrop } from '../composables/use-table-data.ts';

interface IProps {
	rows: IGenericTableRow[];
	sectionId: string;
	columns: IGenericTableColumn[];
	gridTemplateColumns: string;
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
}

interface IEmits {
	(e: 'rowMoved', payload: IDragDropEvent): void;
	(e: 'rowDeleted', payload: { rowId: string; sectionId: string }): void;
}

const props = withDefaults(defineProps<IProps>(), {
	enableDragDrop: true,
	stickyFirstColumn: true,
	enableRowActions: true,
});

const emit = defineEmits<IEmits>();

const { handleDragChange } = useTableDragDrop();

const onDragChange = (evt: IDragEvent) => {
	handleDragChange(
		evt,
		props.sectionId,
		(sectionId: string, oldIndex: number, newIndex: number) => {
			emit('rowMoved', {
				type: 'moved',
				sectionId,
				oldIndex,
				newIndex,
			});
		},
		(evnt: IDragEvent, sectionId: string) => {
			if (evnt.added) {
				emit('rowMoved', {
					type: 'added',
					sectionId,
					newIndex: evnt.added.newIndex,
					element: evnt.added.element,
				});
			}
			if (evnt.removed) {
				emit('rowMoved', {
					type: 'removed',
					sectionId,
					oldIndex: evnt.removed.oldIndex,
					element: evnt.removed.element,
				});
			}
		},
	);
};

const handleRowDelete = (rowId: string, event: Event) => {
	event.stopPropagation();

	if (confirm('Are you sure you want to delete this row?')) {
		emit('rowDeleted', {
			rowId,
			sectionId: props.sectionId,
		});
	}
};
</script>

<template>
	<draggable
		:model-value="rows"
		:group="enableDragDrop ? 'table-rows' : false"
		:disabled="!enableDragDrop"
		item-key="id"
		:class="classes.gridRows"
		@change="onDragChange"
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
					:class="[classes.gridCell, { [classes.stickyFirstCell]: cellIndex === 0 && stickyFirstColumn }]"
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

				<div v-if="enableRowActions" :class="classes.rowActionsCell">
					<div :class="classes.rowActions">
						<button
							:class="[classes.rowActionBtn, classes.deleteBtn]"
							title="Delete row"
							@click="handleRowDelete(row.id, $event)"
						>
							<span :class="classes.deleteIcon">🗑️</span>
						</button>
					</div>
				</div>
			</div>
		</template>
	</draggable>
</template>

<style module="classes">
.gridRows {
	display: flex;
	flex-direction: column;
}

.gridRow {
	display: grid;
	align-items: center;
	min-height: 50px;
	border-bottom: 1px solid rgb(255 255 255 / 5%);
	transition: background-color 0.2s ease;
}

.gridRow:hover {
	background-color: var(--border-color-surface-02-effect, rgb(255 255 255 / 5%));
}

.gridRow:hover .gridCell:first-child {
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.gridRow:hover .rowActionsCell {
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
}

.gridCell {
	display: flex;
	align-items: center;
	min-height: 50px;
	padding: 8px 12px;
	overflow: hidden;
	border-right: 1px solid rgb(255 255 255 / 5%);
}

.gridCell:last-child {
	border-right: none;
}

.stickyFirstCell {
	position: sticky;
	left: 0;
	z-index: 5;
	background: inherit;
}

.rowActionsCell {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 50px;
	min-height: 50px;
	padding: 8px;
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
</style>
