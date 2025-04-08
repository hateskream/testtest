<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import {
	computed,
	ref,
	useCssModule,
	watch,
	type ComponentPublicInstance,
	type CSSProperties,
} from 'vue';
import { GridLayout, GridItem } from 'grid-layout-plus';

const GAP_IN_DND = 24;
const GAP_IN_DND_PX = `${GAP_IN_DND}px`;

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

const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

const rowHeight = computed(() => props.itemHeight - props.gap);

const gridLayoutStyles = computed(
	(): Partial<CSSProperties> => ({
		width: `calc(100% + ${props.gap}px)`,
		margin: `-${props.gap / 2}px`,
	}),
);

const gridItemStyles = computed(
	(): Partial<CSSProperties> =>
		isDnd.value
			? {
					transform: `scale(0.9)`,
				}
			: {
					transform: `scale(1)`,
				},
);

const classListItem = computed(() => ({
	[classes.isDnd]: isDnd.value,
}));

watch(
	props,
	() => {
		layout.value = createGridInitGrid(props.colNum, props.rowNum);
	},
	{ once: true },
);

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

function handleDrag(data: {
	mouseAt: { x: number; y: number };
	parentRect: DOMRect;
	mouseInGrid: boolean;
	dropId: string;
	dragItem: any;
}) {
	if (!gridLayoutRef.value) {
		return;
	}

	const { mouseAt, parentRect, mouseInGrid, dropId, dragItem } = data;
	if (mouseInGrid && !layout.value.find(item => item.i === dropId)) {
		layout.value.push({
			x: (layout.value.length * 2) % props.colNum,
			y: layout.value.length + props.rowNum,
			w: 2,
			h: 2,
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

		Object.assign(item.state, {
			top: mouseAt.y - parentRect.top,
			left: mouseAt.x - parentRect.left,
		});
		const newPos = item.calcXY(mouseAt.y - parentRect.top, mouseAt.x - parentRect.left);

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
			layout.value = layout.value.filter(item1 => item1.i !== dropId);
		}
	}
}

function handleDragEnd(data: {
	mouseAt: { x: number; y: number };
	parentRect: DOMRect;
	mouseInGrid: boolean;
	dragItem: any;
}) {
	if (!gridLayoutRef.value) {
		return;
	}

	const { mouseInGrid, dragItem } = data;
	if (mouseInGrid) {
		alert(`Dropped element props:\n${JSON.stringify(dragItem, ['x', 'y', 'w', 'h'], 2)}`);
		gridLayoutRef.value.dragEvent(
			'dragend',
			'drop',
			dragItem.x,
			dragItem.y,
			dragItem.h,
			dragItem.w,
		);
		layout.value = layout.value.filter(item => item.i !== 'drop');
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
	}
}

function move() {
	isDnd.value = true;
	console.log('move');
}

function moved() {
	isDnd.value = false;
	console.log('moved');
}

function resize() {
	isDnd.value = true;
	console.log('resize');
}

function resized() {
	isDnd.value = false;
	console.log('resized');
}

function updated() {
	isDnd.value = false;
	emit('update');
}
</script>

<template>
	<div :class="classes.gridWrapper">
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
				@drag="handleDrag($event)"
				@drag-end="handleDragEnd($event)"
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
</template>

<style module="classes">
:global(.vgl-item--placeholder) {
	background-color: rgb(0 128 255 / 50%) !important;
	border: 2px solid #0000ff;
	transform: scale(0.9);
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
	background-color: #eeeeee;
	touch-action: none;
	transition: none;
}

:global(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: transparent;
	user-select: none;
}

:global(.vgl-item) {
	transition: 0.1s ease-in !important;
}

:global(.vgl-item--resizing) {
	opacity: 0.9;
}

.gridItem {
	background-color: rgb(200 200 200 / 30%);
}

.text {
	width: 100%;
	height: 100%;
	background-color: rgb(200 200 200 / 30%);
}
</style>
