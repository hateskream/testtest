<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	useCssModule,
	watch,
	type CSSProperties,
} from 'vue';
import { GridLayout, GridItem } from 'grid-layout-plus';
import { throttle } from '@vexip-ui/utils';

interface IGridWidthDashboardsProps {
	itemWidth: number;
	itemHeight: number;
	colNum: number;
	rowNum: number;
	gap: number;
}

const props = defineProps<IGridWidthDashboardsProps>();

const emit = defineEmits<{
	(e: 'update'): void;
	(e: 'update-is-show-grid-state', value: boolean): void;
}>();

const classes = useCssModule('classes');

const isDnd = ref(true);

const layout = ref(
	Array.from({ length: props.colNum * props.rowNum }, (item, index) => {
		const x = index % props.colNum;
		const y = Math.floor(index / props.colNum);
		return {
			x,
			y,
			w: 1,
			h: 1,
			i: String(index),
			static: false,
		};
	}),
);

const wrapper = ref<HTMLElement>();
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

const rowHeight = computed(() => props.itemHeight - props.gap);

const gridLayoutStyles = computed(
	(): Partial<CSSProperties> => ({
		width: `calc(100% + ${props.gap}px)`,
		margin: `-${props.gap / 2}px`,
	}),
);

const classListItem = computed(() => ({
	[classes.isDnd]: isDnd.value,
}));

onMounted(() => {
	document.addEventListener('dragover', syncMousePosition);
});

onBeforeUnmount(() => {
	document.removeEventListener('dragover', syncMousePosition);
});

const mouseAt = { x: -1, y: -1 };

function syncMousePosition(event: MouseEvent) {
	mouseAt.x = event.clientX;
	mouseAt.y = event.clientY;
}

const dropId = 'drop';
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

watch(
	props,
	() => {
		layout.value = createGridInitGrid(props.colNum, props.rowNum);
	},
	{ once: true },
);

const drag = throttle(() => {
	isDnd.value = true;
	emit('update-is-show-grid-state', true);

	const parentRect = wrapper.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left &&
		mouseAt.x < parentRect.right &&
		mouseAt.y > parentRect.top &&
		mouseAt.y < parentRect.bottom;

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
		} catch (e) {}

		// Корректируем позицию с учетом центра элемента
		const offsetX = (dragItem.w * (props.itemWidth - props.gap)) / 2;
		const offsetY = (dragItem.h * rowHeight.value) / 2;
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

function createGridInitGrid(colNum: number, rowNum: number) {
	return Array.from({ length: colNum * rowNum }, (item, index) => {
		const x = index % colNum;
		const y = Math.floor(index / colNum);
		return {
			x,
			y,
			w: 1,
			h: 1,
			i: String(index),
			static: false,
		};
	});
}

function dragEnd() {
	isDnd.value = false;
	emit('update-is-show-grid-state', false);

	const parentRect = wrapper.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left &&
		mouseAt.x < parentRect.right &&
		mouseAt.y > parentRect.top &&
		mouseAt.y < parentRect.bottom;

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
	} catch (e) {}
}

function move() {
	isDnd.value = true;
	emit('update-is-show-grid-state', true);
}

function moved() {
	isDnd.value = false;
	emit('update-is-show-grid-state', false);
}

function resize() {
	isDnd.value = true;
	emit('update-is-show-grid-state', true);
}

function resized() {
	isDnd.value = false;
	emit('update-is-show-grid-state', false);
}

function updated() {
	isDnd.value = false;
	emit('update-is-show-grid-state', false);
	emit('update');
}
</script>

<template>
	<div>
		<div
			:class="classes.droppable"
			draggable="true"
			unselectable="on"
			@drag="drag"
			@dragend="dragEnd"
		>
			Droppable Element (Drag me!)
		</div>
		<div
			ref="wrapper"
			:class="classes.gridWrapper"
		>
			<div
				:class="classes.gridLayout"
				:style="gridLayoutStyles"
			>
				<grid-layout
					ref="gridLayoutRef"
					v-model:layout="layout"
					:col-num="props.colNum"
					:row-height="rowHeight"
					:is-draggable="true"
					:is-resizable="true"
					:use-css-transforms="false"
					:prevent-collision="false"
					:margin="[props.gap, props.gap]"
					@layout-updated="updated"
					@layout-ready="emit('update')"
				>
					<grid-item
						v-for="item in layout"
						:key="item.i"
						:x="item.x"
						:y="item.y"
						:w="item.w"
						:h="item.h"
						:i="item.i"
						:class="classes.gridItem"
						@move="move"
						@moved="moved"
						@resize="resize"
						@resized="resized"
					>
						<div :class="[classes.text, classListItem]">
							{{ item.i }}
						</div>
					</grid-item>
				</grid-layout>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.droppable {
	width: 150px;
	margin: 10px 0;
	padding: 10px;
	text-align: center;
	background-color: #ffdddd;
	border: 1px solid #000000;
}

:global(.vgl-item--placeholder) {
	position: relative;
	z-index: -1;
	background-color: rgb(0 128 255 / 50%) !important;
	border: 2px solid #0000ff;
}

.gridWrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

.gridLayout {
	/* transition:
		width 0.3s ease,
		margin 0.3s ease; */
}

.isDnd {
	transform: scale(0.9);
}

:global(.vgl-layout) {
	touch-action: none;
	transition: none;
}

:global(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: transparent;
	user-select: none;
}

:global(.vgl-item) {
	position: relative;

	/* z-index: -1; */
	transition: 0.1s ease-in !important;
}

:global(.vgl-item--resizing) {
	opacity: 0.9;
}

.gridItem {
	background-color: rgb(200 200 200 / 30%);
}

.text {
	position: relative;
	z-index: 10000;
	width: 100%;
	height: 100%;
	background-color: rgb(200 200 200 / 30%);
}
</style>
