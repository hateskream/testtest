<script setup lang="ts">
import { ref, watch } from 'vue';

import { responsiveGridLayout } from '../composables';
import type { IPosition, IWidget, WidgetType } from '@/modules/dashboard-group';
import type { IWidgetState } from '@/modules/dashboard-group/model';

import EditingGrid from './editing-grid.vue';
import DashboardGrid from './dashboard-grid.vue';

interface IProps {
	widgets: IWidget[];
}

const props = defineProps<IProps>();

const emit = defineEmits<{
	(e: 'add-widget', type: WidgetType, position: IPosition, widgetsState: IWidgetState[]): void;
	(e: 'delete-widget', widgetId: string, widgetsState: IWidgetState[]): void;
	(e: 'change-dashboard-state', widgetsState: IWidgetState[]): void;
	(e: 'is-edit', value: boolean): void;
}>();

const gridRef = ref<HTMLDivElement | null>(null);


const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid } =
	responsiveGridLayout(gridRef);

const isEditState = ref(true);

watch(isEditState, value => {
	emit('is-edit', value);
});

function updateIsShowGridState(value: boolean) {
	isEditState.value = value;
}

function emitAddWidget(type: WidgetType, position: IPosition, widgetsState: IWidgetState[]) {
	emit('add-widget', type, position, widgetsState);
}

function emitDeleteWidget(widgetId: string, widgetsState: IWidgetState[]) {
	emit('delete-widget', widgetId, widgetsState);
}
</script>

<template>
	<div
		ref="gridRef"
		:class="classes.root"
	>
		<div
			v-show="isEditState"
			:class="classes.grid"
		>
			<editing-grid
				:col-num="columnsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
				:row-num="rowNumGrid"
			/>
		</div>
		<div :class="classes.content">
			<dashboard-grid
				:column-width="columnWidth"
				:widgets="props.widgets"
				:is-dnd="isEditState"
				:columns-num="columnsNum"
				:row-height="rowHeight"
				:rows-num="rowsNum"
				:col-width="columnWidth"
				:row-num="rowsNum"
				@update-is-show-grid-state="updateIsShowGridState"
				@add-widget="emitAddWidget"
				@delete-widget="emitDeleteWidget"
				@change-dashboard-state="emit('change-dashboard-state', $event)"
			>
				<template #dashboard-content="{ dashboardItem, meta }">
					<slot
						name="dashboard-content"
						:dashboard-item="dashboardItem"
						:meta="meta"
					/>
				</template>
			</dashboard-grid>
		</div>
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	flex-grow: 1;
	width: 100%;
}

.content {
	position: relative;
	width: 100%;
}

.grid {
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>
