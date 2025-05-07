<script setup lang="ts">
import draggableComponent from 'vuedraggable';

import { useMarketStore } from '../stores';

import TableColumnWithSortComponent from './table-column-with-sort-component.vue';
import TableMetricsComponent from './table-metrics-component.vue';

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
		:ghost-class="classes.dragPlaceholder"
		:class="classes.thead"
		:delay="150"
		@update:model-value="marketStore.updateActiveTableColumns"
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
			<th :class="classes.iconTertiary">
				<table-metrics-component />
			</th>
		</template>
	</draggable-component>
</template>
<style module="classes">
.tableContainer {
	padding: 0 16px 18px;
}

.dragPlaceholder::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 2;
	width: 1px;
	height: 16px;
	background: var(--border-color-base-300);
	transform: translate(-50%, -50%);
}

.dragPlaceholder::after {
	content: '';
	position: absolute;
	top: -1px;
	left: -1px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: calc(100% + 2px);
	height: calc(100% + 2px);
	color: var(--border-color-base-300);
	background: var(--bg-color-surface-01);
}

.thead {
	display: table;
	min-width: 100%;
	table-layout: fixed;
}

.thead th {
	position: relative;
	min-width: 100px;
	height: 28px;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-100);
	cursor: pointer;
	user-select: none;
}

.iconTertiary {
	position: sticky !important;
	top: 0;
	right: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	min-width: 50px !important;
	padding-right: 8px;
}

.thead th:first-child {
	position: sticky;
	top: 0;
	left: 0;
	z-index: 21;
	background-color: var(--bg-color-surface-01);
}

.dragActive {
	display: flex;
	align-items: center;
	width: max-content;
	height: 28px;
	padding-inline: 10px !important;
	text-align: center !important;
	color: var(--text-color-base-100-effect) !important;
	background-color: var(--bg-tooltip-color-base) !important;
	border: 1px solid rgb(255 255 255 / 8%);
	border-radius: 8px;
	opacity: 1;
}
</style>
