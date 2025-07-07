<!-- GenericGridRows.vue -->
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
		class="grid-rows"
		@change="onDragChange"
	>
		<template #item="{ element: row, index: rowIndex }">
			<div
				:key="row.id"
				class="grid-row"
				:style="{ gridTemplateColumns }"
			>
				<div
					v-for="(column, cellIndex) in columns"
					:key="`${row.id}-${column.key}`"
					class="grid-cell"
					:class="{ 'sticky-first-cell': cellIndex === 0 && stickyFirstColumn }"
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

				<div v-if="enableRowActions" class="row-actions-cell">
					<div class="row-actions">
						<button
							class="row-action-btn delete-btn"
							title="Delete row"
							@click="handleRowDelete(row.id, $event)"
						>
							<span class="delete-icon">🗑️</span>
						</button>
					</div>
				</div>
			</div>
		</template>
	</draggable>
</template>

<style scoped>
.grid-rows {
	display: flex;
	flex-direction: column;
}

.grid-row {
	display: grid;
	align-items: center;
	min-height: 50px;
	border-bottom: 1px solid rgb(255 255 255 / 5%);
	transition: background-color 0.2s ease;
}

.grid-row:hover {
	background-color: var(--border-color-surface-02-effect, rgb(255 255 255 / 5%));
}

.grid-row:hover .grid-cell:first-child {
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.grid-row:hover .row-actions-cell {
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
}

.grid-cell {
	display: flex;
	align-items: center;
	min-height: 50px;
	padding: 8px 12px;
	overflow: hidden;
	border-right: 1px solid rgb(255 255 255 / 5%);
}

.grid-cell:last-child {
	border-right: none;
}

.sticky-first-cell {
	position: sticky;
	left: 0;
	z-index: 5;
	background: inherit;
}

.row-actions-cell {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 50px;
	min-height: 50px;
	padding: 8px;
}

.row-actions {
	display: flex;
	gap: 4px;
	opacity: 0;
	transition: opacity 0.2s ease;
}

.grid-row:hover .row-actions {
	opacity: 1;
}

.row-action-btn {
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

.row-action-btn:hover {
	background: rgb(255 255 255 / 10%);
	border-color: rgb(255 255 255 / 20%);
}

.delete-btn:hover {
	background: rgb(255 77 79 / 20%);
	border-color: rgb(255 77 79 / 40%);
}

.delete-icon {
	font-size: 14px;
	color: var(--text-color-base-300, #9a9a9d);
	transition: color 0.2s ease;
}

.delete-btn:hover .delete-icon {
	color: #ff4d4f;
}
</style>
