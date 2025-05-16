<script setup lang="ts">
import draggableComponent from 'vuedraggable';

import { useMarketStore } from '../stores';

import TableColumnWithSortComponent from './table-column-with-sort-component.vue';
import TableIconSettingsComponent from './table-icon-settings-component.vue';

const marketStore = useMarketStore();

const ignoreDragClass = 'ignoreDrag';

function getSortDirection(columnName: string) {
	return marketStore.activeSort.columnName === columnName ? marketStore.activeSort.direction : 0;
}
</script>

<template>
	<draggable-component
		:model-value="marketStore.activeTableColumns"
		tag="div"
		item-key="position"
		:filter="`.${ignoreDragClass}`"
		:chosen-class="classes.dragActive"
		:ghost-class="classes.dragPlaceholder"
		:class="classes.gridHead"
		:delay="150"
		@update:model-value="marketStore.updateActiveTableColumns"
	>
		<template #item="{ element: column }">
			<table-column-with-sort-component
				:class="[classes.gridHeadItem, { [ignoreDragClass]: !column.isDraggable }]"
				:column="column"
				:sort-direction="getSortDirection(column.columnName)"
				@click="marketStore.toggleActiveSort(column)"
			/>
		</template>

		<template #footer>
			<table-icon-settings-component :class="[classes.gridHeadItem, classes.iconTertiary]" />
		</template>
	</draggable-component>
</template>

<style module="classes">
.gridHead {
	position: sticky;
	top: 0;
	z-index: 2;
	display: grid;
	background-color: var(--bg-color-surface-01);
	grid-column: 1 / -1;
	grid-template-columns: subgrid;
}

.gridHeadItem {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 28px;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-100);
	cursor: pointer;
	user-select: none;
}

.gridHeadItem:first-child {
	position: sticky;
	left: 0;
	justify-content: flex-start;
	background-color: var(--bg-color-surface-01);
}

.iconTertiary {
	position: sticky;
	right: 0;
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

.dragActive {
	justify-content: center;
	width: 100%;
	color: var(--text-color-base-100-effect) !important;
	background-color: var(--bg-tooltip-color-base) !important;
	border: 1px solid rgb(255 255 255 / 8%);
	border-radius: 8px;
	opacity: 1;
	padding-inline: 10px !important;
}
</style>
