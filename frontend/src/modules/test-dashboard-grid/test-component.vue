<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import type { GridLayout, Layout } from 'grid-layout-plus';
import { throttle, debounce } from '@vexip-ui/utils';

import { responsiveGridLayout } from './composables';
import { GAP } from './constants';

import GridComponents from './grid-components.vue';
import DraggableElement from './draggable-element.vue';
import GridLayoutComponent from './grid-layout-component.vue';

const grid = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid, updateColumnsNumGrid } =
	responsiveGridLayout(grid);

const isEditState = ref(false);

const layout = ref<Layout>(
	Array.from({ length: columnsNum.value * rowsNum.value }, (item, index) => ({
		x: index % columnsNum.value,
		y: Math.floor(index / columnsNum.value),
		w: 1,
		h: 1,
		i: String(index),
		static: false,
	})),
);

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

const rowHeightComputed = computed(() => rowHeight.value - GAP);
const mouseAt = { x: -1, y: -1 };
const dropId = 'drop';
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

watch(
	[columnsNum, rowsNum],
	() => {
		layout.value = createGridInitGrid(columnsNum.value, rowsNum.value);
	},
	{ immediate: true },
);

function syncMousePosition(event: MouseEvent | TouchEvent) {
	if ('touches' in event) {
		const touch = event.touches[0];
		mouseAt.x = touch.clientX;
		mouseAt.y = touch.clientY;
	} else {
		mouseAt.x = event.clientX;
		mouseAt.y = event.clientY;
	}
}

onMounted(() => {
	document.addEventListener('dragover', syncMousePosition);
	document.addEventListener('mousemove', syncMousePosition);
	document.addEventListener('touchmove', syncMousePosition, { passive: false });
});

onBeforeUnmount(() => {
	document.removeEventListener('dragover', syncMousePosition);
	document.removeEventListener('mousemove', syncMousePosition);
	document.removeEventListener('touchmove', syncMousePosition);
});

function createGridInitGrid(colNum: number, rowNum: number) {
	return Array.from({ length: colNum * rowNum }, (item, index) => ({
		x: index % colNum,
		y: Math.floor(index / colNum),
		w: 1,
		h: 1,
		i: String(index),
		static: false,
	}));
}

function updateIsShowGridState(value: boolean) {
	isEditState.value = value;
}

function setWrapper(wrapper: HTMLDivElement) {
	wrapperRef.value = wrapper;
}

function setGridLayoutRef(gridLayout: InstanceType<typeof GridLayout>) {
	gridLayoutRef.value = gridLayout;
}

const drag = throttle(() => {
	isEditState.value = true;

	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left - 20 &&
		mouseAt.x < parentRect.right - 20 &&
		mouseAt.y > parentRect.top - 20 &&
		mouseAt.y < parentRect.bottom - 20;

	if (mouseInGrid && !layout.value.find(item => item.i === dropId)) {
		const centerX = Math.floor(columnsNum.value / 2) - Math.floor(dragItem.w / 2);
		const centerY = Math.floor(rowsNum.value / 2) - Math.floor(dragItem.h / 2);
		layout.value.push({
			x: Math.max(0, Math.min(centerX, columnsNum.value - dragItem.w)),
			y: Math.max(0, Math.min(centerY, rowsNum.value - dragItem.h)),
			w: dragItem.w,
			h: dragItem.h,
			i: dropId,
			static: false,
		});
	}

	const index = layout.value.findIndex(item => item.i === dropId);

	if (index !== -1) {
		const item = gridLayoutRef.value.getItem(dropId);

		if (!item) {
			return;
		}

		try {
			item.wrapper.style.display = 'none';
		} catch (e) {
			console.error(e);
		}

		const offsetX = (dragItem.w * (columnWidth.value - GAP)) / 2;
		const offsetY = (dragItem.h * rowHeightComputed.value) / 2;
		Object.assign(item.state, {
			top: mouseAt.y - parentRect.top - offsetY,
			left: mouseAt.x - parentRect.left - offsetX,
		});

		const newPos = item.calcXY(
			mouseAt.y - parentRect.top - offsetY,
			mouseAt.x - parentRect.left - offsetX,
		);

		if (mouseInGrid) {
			gridLayoutRef.value.dragEvent(
				'dragstart',
				dropId,
				newPos.x,
				newPos.y,
				dragItem.h,
				dragItem.w,
			);
			dragItem.i = String(index);
			dragItem.x = layout.value[index].x;
			dragItem.y = layout.value[index].y;
		} else {
			gridLayoutRef.value.dragEvent(
				'dragend',
				dropId,
				newPos.x,
				newPos.y,
				dragItem.h,
				dragItem.w,
			);
			layout.value = layout.value.filter(el => el.i !== dropId);
		}
	}
});

const dragEnd = debounce(() => {
	isEditState.value = false;

	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		layout.value = layout.value.filter(item => item.i !== dropId);
		isEditState.value = false;
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left &&
		mouseAt.x < parentRect.right &&
		mouseAt.y > parentRect.top &&
		mouseAt.y < parentRect.bottom;

	if (mouseInGrid) {
		const placeholder = layout.value.find(item => item.i === dropId);

		if (!placeholder) {
			console.warn('Placeholder not found in layout:', dropId);
			layout.value = layout.value.filter(item => item.i !== dropId);
			return;
		}

		const item = gridLayoutRef.value.getItem(dropId);

		try {
			if (item) {
				item.wrapper.style.display = '';
			}
		} catch (e) {
			console.error('Error restoring placeholder display:', e);
		} finally {
			isEditState.value = false;
		}

		const finalX = Math.max(0, Math.min(placeholder.x, columnsNum.value - dragItem.w));
		const finalY = Math.max(0, Math.min(placeholder.y, rowsNum.value - dragItem.h));

		layout.value = layout.value.filter(el => el.i !== dropId);

		const newItemId = String(Date.now());
		layout.value.push({
			x: finalX,
			y: finalY,
			w: dragItem.w,
			h: dragItem.h,
			i: newItemId,
			static: false,
		});

		gridLayoutRef.value.dragEvent('dragend', newItemId, finalX, finalY, dragItem.h, dragItem.w);
	} else {
		layout.value = layout.value.filter(item => item.i !== dropId);
	}
});
</script>

<template>
	<div :class="classes.testWrapper">
		<draggable-element
			@drag="drag"
			@drag-end="dragEnd"
		/>
		<div
			ref="grid"
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
					v-model="layout"
					:is-dnd="isEditState"
					:col-num="columnsNum"
					:row-height="rowHeightComputed"
					:gap="GAP"
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

	/* width: 100%; */
	min-height: 100%;
}

.droppable {
	margin-bottom: 20px;
}

.root {
	position: relative;
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	width: 100%;

	/* min-height: 100%; */

	/* overflow: hidden; */
}

.content {
	position: relative;
	width: 100%;
}

.grid {
	position: absolute;

	/* z-index: -1; */
	width: 100%;
	height: 100%;
}
</style>
