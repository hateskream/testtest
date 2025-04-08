<script setup lang="ts">
import draggableComponent from 'vuedraggable';
import { ref } from 'vue';

import { useMarketStore } from '../stores';
import { IconIds, UiIcon } from '@/shared/ui/icon';

import TableColumnWithSortComponent from './table-column-with-sort-component.vue';
import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const marketStore = useMarketStore();

const isTableHeadColumns = ref(false);
</script>

<template>
	<draggable-component
		:model-value="marketStore.activeTableColumns"
		tag="thead"
		item-key="position"
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
			<th>
				<table-column-with-sort-component
					:column="column"
					:sort-direction="
						marketStore.activeSort.columnName === column.columnName
							? marketStore.activeSort.direction
							: 0
					"
					@click="marketStore.toggleActiveSort(column)"
				/>
			</th>
		</template>

		<template #footer>
			<th :class="classes.iconWrapperTertiary">
				<ui-icon
					:id="IconIds.Tertiary"
					:class="classes.iconTertiary"
					width="20"
					height="20"
					@click="isTableHeadColumns = !isTableHeadColumns"
				/>

				<table-columns-settings-component v-show="isTableHeadColumns" />
			</th>
		</template>
	</draggable-component>
</template>
<style module="classes">
.tableContainer {
	padding: 0 16px 18px;
}

.iconWrapperTertiary {
	position: relative;
	width: 45px;
}

.thead {
	display: table;
	width: 100%;
	table-layout: fixed;
}

.iconTertiary {
	color: var(--icon-color-base-300);
	transition: color 0.3s ease-in;
}

.iconTertiary:hover {
	color: var(--icon-color-base-300-effect);
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

.thead > th:first-child {
	position: sticky;
	top: 0;
	left: 0;
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
