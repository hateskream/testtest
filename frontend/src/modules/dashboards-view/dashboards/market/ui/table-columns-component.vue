<script setup lang="ts">
import draggableComponent from 'vuedraggable';

import { useMarketStore } from '../stores';

import TableColumnWithSortComponent from './table-column-with-sort-component.vue';

const marketStore = useMarketStore();

const ignoreDragClass = 'ignoreDrag';

function getSortDirection(columnName: string) {
	return marketStore.activeSort.columnName === columnName ? marketStore.activeSort.direction : 0;
}
</script>

<template>
	<draggable-component
		:model-value="marketStore.activeTableColumns"
		tag="thead"
		item-key="position"
		:filter="`.${ignoreDragClass}`"
		:chosen-class="classes.dragActive"
		:class="classes.thead"
		:delay="150"
		@update:model-value="
			marketStore.$patch({
				activeTableColumns: $event,
			})
		"
	>
		<template #item="{ element: column }">
			<th :class="{ [ignoreDragClass]: !column.isDraggable }">
				<table-column-with-sort-component
					:column="column"
					:sort-direction="getSortDirection(column.columnName)"
					@click="marketStore.toggleActiveSort(column)"
				/>
			</th>
		</template>

		<template #footer>
			<th :class="classes.iconTertiary" />
		</template>
	</draggable-component>
</template>
<style module="classes">
.tableContainer {
	padding: 0 16px 18px;
}

.thead {
	display: table;
	width: max-content;
	min-width: calc(100% - 45px);
	table-layout: fixed;
}

.thead th {
	min-width: 100px;
	padding: 4px 0;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-100);
	cursor: pointer;
	user-select: none;
}

.iconTertiary {
	width: 20px;
	min-width: 40px !important;
}

.thead th:first-child {
	position: sticky;
	top: 0;
	left: 0;
	z-index: 20;
	background-color: var(--bg-color-surface-01);
}

.dragActive {
	display: flex;
	align-items: center;
	width: max-content;
	padding: 6px 10px !important;
	text-align: center !important;
	color: var(--text-color-base-100-effect) !important;
	background-color: var(--bg-tooltip-color-base) !important;
	border: 1px solid rgb(255 255 255 / 8%);
	border-radius: 8px;
	opacity: 1;
}
</style>
