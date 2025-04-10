<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue';
import type { GridLayout, Layout } from 'grid-layout-plus';
import { throttle } from '@vexip-ui/utils';

import DraggableElement from './draggable-element.vue';
import GridLayoutComponent from './grid-layout-component.vue';

interface IGridWidthDashboardsProps {
	itemWidth: number;
	itemHeight: number;
	colNum: number;
	rowNum: number;
	gap: number;
	mouseAt: { x: number; y: number };
}

const props = defineProps<IGridWidthDashboardsProps>();
const emit = defineEmits<{
	(e: 'update'): void;
	(e: 'update-is-show-grid-state', value: boolean): void;
}>();

const isDnd = ref(true);
const layout = ref<Layout>(
	Array.from({ length: props.colNum * props.rowNum }, (item, index) => ({
		x: index % props.colNum,
		y: Math.floor(index / props.colNum),
		w: 1,
		h: 1,
		i: String(index),
		static: false,
	})),
);

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

const rowHeight = computed(() => props.itemHeight - props.gap);
// const mouseAt = { x: -1, y: -1 };
const dropId = 'drop';
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

watch(
	props,
	() => {
		layout.value = createGridInitGrid(props.colNum, props.rowNum);
	},
	{ once: true },
);

// onMounted(() => {
// 	document.addEventListener('dragover', syncMousePosition);
// });

// onBeforeUnmount(() => {
// 	document.removeEventListener('dragover', syncMousePosition);
// });

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
	isDnd.value = value;
	emit('update-is-show-grid-state', value);
}

function setWrapper(wrapper: HTMLDivElement) {
	wrapperRef.value = wrapper;
}

function setGridLayoutRef(gridLayout: InstanceType<typeof GridLayout>) {
	gridLayoutRef.value = gridLayout;
}

// function syncMousePosition(event: MouseEvent) {
// 	mouseAt.x = event.clientX;
// 	mouseAt.y = event.clientY;
// }

const drag = throttle(() => {
	isDnd.value = true;
	emit('update-is-show-grid-state', true);

	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		return;
	}

	const mouseInGrid =
		props.mouseAt.x > parentRect.left &&
		props.mouseAt.x < parentRect.right &&
		props.mouseAt.y > parentRect.top &&
		props.mouseAt.y < parentRect.bottom;

	if (mouseInGrid && !layout.value.find(item => item.i === dropId)) {
		// Центрируем начальную позицию заполнителя
		const centerX = Math.floor(props.colNum / 2) - Math.floor(dragItem.w / 2);
		const centerY = Math.floor(props.rowNum / 2) - Math.floor(dragItem.h / 2);
		layout.value.push({
			x: Math.max(0, Math.min(centerX, props.colNum - dragItem.w)), // Ограничиваем по ширине сетки
			y: Math.max(0, Math.min(centerY, props.rowNum - dragItem.h)), // Ограничиваем по высоте сетки
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

		// Корректируем позицию с учетом центра элемента
		const offsetX = (dragItem.w * (props.itemWidth - props.gap)) / 2;
		const offsetY = (dragItem.h * rowHeight.value) / 2;
		Object.assign(item.state, {
			top: props.mouseAt.y - parentRect.top - offsetY,
			left: props.mouseAt.x - parentRect.left - offsetX,
		});

		const newPos = item.calcXY(
			props.mouseAt.y - parentRect.top - offsetY,
			props.mouseAt.x - parentRect.left - offsetX,
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

function dragEnd() {
	isDnd.value = false;
	emit('update-is-show-grid-state', false);

	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		return;
	}

	const mouseInGrid =
		props.mouseAt.x > parentRect.left &&
		props.mouseAt.x < parentRect.right &&
		props.mouseAt.y > parentRect.top &&
		props.mouseAt.y < parentRect.bottom;

	if (mouseInGrid) {
		gridLayoutRef.value.dragEvent(
			'dragend',
			dropId,
			dragItem.x,
			dragItem.y,
			dragItem.h,
			dragItem.w,
		);
		layout.value = layout.value.filter(item => item.i !== dropId);
	} else {
		return;
	}

	layout.value.push({
		x: dragItem.x,
		y: dragItem.y,
		w: dragItem.w,
		h: dragItem.h,
		i: dragItem.i,
		static: false,
	});
	gridLayoutRef.value.dragEvent(
		'dragend',
		dragItem.i,
		dragItem.x,
		dragItem.y,
		dragItem.h,
		dragItem.w,
	);

	const item = gridLayoutRef.value.getItem(dropId);

	if (!item) {
		return;
	}

	try {
		item.wrapper.style.display = '';
	} catch (e) {
		console.error(e);
	}
}
</script>

<template>
	<div>
		<draggable-element
			@drag="drag"
			@drag-end="dragEnd"
		/>
		<grid-layout-component
			ref="wrapper"
			v-model="layout"
			:is-dnd="isDnd"
			:col-num="props.colNum"
			:row-height="rowHeight"
			:gap="props.gap"
			@update-is-show-grid-state="updateIsShowGridState"
			@set-wrapper="setWrapper"
			@set-grid-layout-ref="setGridLayoutRef"
		/>
	</div>
</template>
