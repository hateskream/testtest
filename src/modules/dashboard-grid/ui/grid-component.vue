<script setup lang="ts">
import { ref } from 'vue';
import type { GridLayout } from 'grid-layout-plus';

import { responsiveGridLayout } from '../composables';
import type { IDashboardFolder, IDashboardGroup, IDashboardInstance, IDashboardStack } from '@/modules/dashboard-group';

import EditingGrid from './editing-grid.vue';
import DashboardGrid from './dashboard-grid.vue';

interface IProps {
	dashboards: IDashboardGroup;
}

const props = defineProps<IProps>();

const emit = defineEmits<{
	(e: 'add-widget', newItems: (IDashboardInstance | IDashboardFolder | IDashboardStack)[]): void;
}>();

const gridRef = ref<HTMLDivElement | null>(null);


const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid } =
	responsiveGridLayout(gridRef);

const isEditState = ref(true);

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

function setWrapper(wrapper: HTMLDivElement) {
	wrapperRef.value = wrapper;
}

function updateIsShowGridState(value: boolean) {
	isEditState.value = value;
}

function setGridLayoutRef(gridLayout: InstanceType<typeof GridLayout>) {
	gridLayoutRef.value = gridLayout;
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
				:dashboards="props.dashboards"
				:is-dnd="isEditState"
				:columns-num="columnsNum"
				:row-height="rowHeight"
				:rows-num="rowNumGrid"
				:col-width="columnWidth"
				:row-num="rowsNum"
				@update-is-show-grid-state="updateIsShowGridState"
				@set-wrapper="setWrapper"
				@set-grid-layout-ref="setGridLayoutRef"
				@add-widget="emit('add-widget', $event)"
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
.droppable {
	margin-bottom: 20px;
}

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
