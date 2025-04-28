<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRefs, computed } from 'vue';
import type { GridLayout, Layout } from 'grid-layout-plus';
import { throttle, debounce } from '@vexip-ui/utils';

import {
	responsiveGridLayout,
	useMousePositionSync,
	useRebuildingGrid,
} from '../../../composables';
import type { IDashboardGroup, IPosition, IPositionWithId } from '../../../model';

import EditingGrid from './editing-grid.vue';
import DraggableElement from './draggable-element.vue';
import DashboardGrid from './dashboard-grid.vue';

interface IProps {
	dashboards: IDashboardGroup;
}

const props = defineProps<IProps>();

const gridRef = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid, updateColumnsNumGrid } =
	responsiveGridLayout(gridRef);

// const { mouseAt } = useMousePositionSync();
const isEditState = ref(true);

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

// const dropId = 'drop';
// const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

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
	<div :class="classes.testWrapper">
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
					:dashboards="dashboards"
					:is-dnd="isEditState"
					:columns-num="columnsNum"
					:row-height="rowHeight"
					:rows-num="rowNumGrid"
					:col-width="columnWidth"
					:row-num="rowsNum"
					@update-is-show-grid-state="updateIsShowGridState"
					@set-wrapper="setWrapper"
					@set-grid-layout-ref="setGridLayoutRef"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.testWrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100%;
}

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
