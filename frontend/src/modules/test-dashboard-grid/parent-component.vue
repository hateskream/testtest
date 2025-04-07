<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { throttle } from '@vexip-ui/utils'; // or your own throttle implementation

import { responsiveGridLayout } from './composables';
import { GAP } from './constants';

import GridComponents from './grid-components.vue';
import GridWithDashboards from './grid-with-dashboards.vue';

const grid = ref<HTMLDivElement | null>(null);
const wrapper = ref<HTMLElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid, updateColumnsNumGrid } =
	responsiveGridLayout(grid);

const isShowGrid = ref(true);

// Drag and drop state
const mouseAt = { x: -1, y: -1 };
const dropId = 'drop';
const dragItem = ref({ x: -1, y: -1, w: 2, h: 2, i: '' });

function syncMousePosition(event: MouseEvent) {
	mouseAt.x = event.clientX;
	mouseAt.y = event.clientY;
}

const drag = throttle(() => {
	const parentRect = wrapper.value?.getBoundingClientRect();
	if (!parentRect) {
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left &&
		mouseAt.x < parentRect.right &&
		mouseAt.y > parentRect.top &&
		mouseAt.y < parentRect.bottom;

	emit('drag', { mouseAt, parentRect, mouseInGrid, dropId, dragItem: dragItem.value });
}, 50);

function dragEnd() {
	const parentRect = wrapper.value?.getBoundingClientRect();
	if (!parentRect) {
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left &&
		mouseAt.x < parentRect.right &&
		mouseAt.y > parentRect.top &&
		mouseAt.y < parentRect.bottom;

	emit('dragEnd', { mouseAt, parentRect, mouseInGrid, dragItem: dragItem.value });
}

onMounted(() => {
	document.addEventListener('dragover', syncMousePosition);
});

onBeforeUnmount(() => {
	document.removeEventListener('dragover', syncMousePosition);
});

const emit = defineEmits<{
	(
		e: 'drag',
		data: {
			mouseAt: { x: number; y: number };
			parentRect: DOMRect;
			mouseInGrid: boolean;
			dropId: string;
			dragItem: typeof dragItem.value;
		},
	): void;
	(
		e: 'dragEnd',
		data: {
			mouseAt: { x: number; y: number };
			parentRect: DOMRect;
			mouseInGrid: boolean;
			dragItem: typeof dragItem.value;
		},
	): void;
}>();
</script>

<template>
	<div
		ref="grid"
		:class="classes.root"
	>
		<div
			class="droppable-element"
			draggable="true"
			unselectable="on"
			@drag="drag"
			@dragend="dragEnd"
		>
			Droppable Element (Drag me!)
		</div>
		<div
			v-show="isShowGrid"
			:class="classes.grid"
		>
			<grid-components
				:col-num="columnsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
				:row-num="rowNumGrid"
			/>
		</div>
		<div
			ref="wrapper"
			:class="classes.content"
		>
			<grid-with-dashboards
				:col-num="columnsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
				:row-num="rowsNum"
				:gap="GAP"
				@update="updateColumnsNumGrid"
				@drag="emit('drag', $event)"
				@drag-end="emit('dragEnd', $event)"
			/>
		</div>
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100%;
	overflow: hidden;
}

.content {
	position: relative;
	width: 100%;
}

.grid {
	position: absolute;
	z-index: -1;
	width: 100%;
	height: 100%;
}

.droppable-element {
	width: 150px;
	margin: 10px 0;
	padding: 10px;
	text-align: center;
	background-color: #ffdddd;
	border: 1px solid #000000;
}
</style>
