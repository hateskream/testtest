<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRefs } from 'vue';
import type { GridLayout, Layout } from 'grid-layout-plus';
import { throttle, debounce } from '@vexip-ui/utils';

import {
	responsiveGridLayout,
	useMousePositionSync,
	useRebuildingGrid,
} from '../../../composables';
import type { IPosition } from '../../../model';

import GridComponents from './grid-components.vue';
import DraggableElement from './draggable-element.vue';
import GridLayoutComponent from './grid-layout-component.vue';

interface IProps {
	dashboards: IPosition[];
}

const props = defineProps<IProps>();

const { dashboards: rawDashboards } = toRefs(props); // props

const gridRef = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid, updateColumnsNumGrid } =
	responsiveGridLayout(gridRef);

const isEditState = ref(true);

const { layout } = useRebuildingGrid(columnsNum, rowsNum, rawDashboards);

// const { mouseAt } = useMousePositionSync();

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

// const drag = throttle(() => {
// 	isEditState.value = true;

// 	const parentRect = wrapperRef.value?.getBoundingClientRect();

// 	if (!parentRect || !gridLayoutRef.value) {
// 		return;
// 	}

// 	const mouseInGrid =
// 		mouseAt.value.x > parentRect.left - 20 &&
// 		mouseAt.value.x < parentRect.right - 20 &&
// 		mouseAt.value.y > parentRect.top - 20 &&
// 		mouseAt.value.y < parentRect.bottom - 20;

// 	if (mouseInGrid && !layout.value.find(item => item.i === dropId)) {
// 		const centerX = Math.floor(columnsNum.value / 2) - Math.floor(dragItem.w / 2);
// 		const centerY = Math.floor(rowsNum.value / 2) - Math.floor(dragItem.h / 2);
// 		layout.value.push({
// 			x: Math.max(0, Math.min(centerX, columnsNum.value - dragItem.w)),
// 			y: Math.max(0, Math.min(centerY, rowsNum.value - dragItem.h)),
// 			w: dragItem.w,
// 			h: dragItem.h,
// 			i: dropId,
// 			static: false,
// 		});
// 	}

// 	const index = layout.value.findIndex(item => item.i === dropId);

// 	if (index !== -1) {
// 		const item = gridLayoutRef.value.getItem(dropId);

// 		if (!item) {
// 			return;
// 		}

// 		try {
// 			item.wrapper.style.display = 'none';
// 		} catch (e) {
// 			console.error(e);
// 		}

// 		const offsetX = (dragItem.w * columnWidth.value) / 2;
// 		const offsetY = (dragItem.h * rowHeight.value) / 2;
// 		Object.assign(item.state, {
// 			top: mouseAt.value.y - parentRect.top - offsetY,
// 			left: mouseAt.value.x - parentRect.left - offsetX,
// 		});

// 		const newPos = item.calcXY(
// 			mouseAt.value.y - parentRect.top - offsetY,
// 			mouseAt.value.x - parentRect.left - offsetX,
// 		);

// 		if (mouseInGrid) {
// 			gridLayoutRef.value.dragEvent(
// 				'dragstart',
// 				dropId,
// 				newPos.x,
// 				newPos.y,
// 				dragItem.h,
// 				dragItem.w,
// 			);
// 			dragItem.i = String(index);
// 			dragItem.x = layout.value[index].x;
// 			dragItem.y = layout.value[index].y;
// 		} else {
// 			gridLayoutRef.value.dragEvent(
// 				'dragend',
// 				dropId,
// 				newPos.x,
// 				newPos.y,
// 				dragItem.h,
// 				dragItem.w,
// 			);
// 			layout.value = layout.value.filter(el => el.i !== dropId);
// 		}
// 	}
// });

// const dragEnd = debounce(() => {
// 	isEditState.value = false;

// 	const parentRect = wrapperRef.value?.getBoundingClientRect();

// 	if (!parentRect || !gridLayoutRef.value) {
// 		layout.value = layout.value.filter(item => item.i !== dropId);
// 		isEditState.value = false;
// 		return;
// 	}

// 	const mouseInGrid =
// 		mouseAt.value.x > parentRect.left &&
// 		mouseAt.value.x < parentRect.right &&
// 		mouseAt.value.y > parentRect.top &&
// 		mouseAt.value.y < parentRect.bottom;

// 	if (mouseInGrid) {
// 		const placeholder = layout.value.find(item => item.i === dropId);

// 		if (!placeholder) {
// 			console.warn('Placeholder not found in layout:', dropId);
// 			layout.value = layout.value.filter(item => item.i !== dropId);
// 			return;
// 		}

// 		const item = gridLayoutRef.value.getItem(dropId);

// 		try {
// 			if (item) {
// 				item.wrapper.style.display = '';
// 			}
// 		} catch (e) {
// 			console.error('Error restoring placeholder display:', e);
// 		} finally {
// 			isEditState.value = false;
// 		}

// 		const finalX = Math.max(0, Math.min(placeholder.x, columnsNum.value - dragItem.w));
// 		const finalY = Math.max(0, Math.min(placeholder.y, rowsNum.value - dragItem.h));

// 		layout.value = layout.value.filter(el => el.i !== dropId);

// 		const newItemId = String(Date.now());
// 		layout.value.push({
// 			x: finalX,
// 			y: finalY,
// 			w: dragItem.w,
// 			h: dragItem.h,
// 			i: newItemId,
// 			static: false,
// 		});

// 		gridLayoutRef.value.dragEvent('dragend', newItemId, finalX, finalY, dragItem.h, dragItem.w);
// 	} else {
// 		layout.value = layout.value.filter(item => item.i !== dropId);
// 	}
// });
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
				<grid-components
					:col-num="columnsNum"
					:item-height="rowHeight"
					:item-width="columnWidth"
					:row-num="rowNumGrid"
				/>
			</div>
			<div :class="classes.content">
				<grid-layout-component
					:model-value="layout"
					:is-dnd="isEditState"
					:col-num="columnsNum"
					:row-height="rowHeight"
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
