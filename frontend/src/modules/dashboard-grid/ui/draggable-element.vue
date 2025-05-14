<script setup lang="ts">
import { onMounted, ref } from 'vue';

import GhostComponentBase from './ghost-component-base.vue';

interface ISize {
	height: number;
	width: number;
}

interface IDraggableElementProps {
	title: string;
}

const props = defineProps<IDraggableElementProps>();

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
}>();

const sizeGhostElement: ISize = {
	height: 0,
	width: 0,
}

let isDragging = false;


const customGhost = ref<HTMLDivElement | null>(null);

onMounted(() => {
	if (customGhost.value) {
		sizeGhostElement.height = customGhost.value.clientHeight;
		sizeGhostElement.width = customGhost.value.clientWidth;
	}
})

const onDragStart = (event: DragEvent) => {
	if (event.dataTransfer && customGhost.value) {
		const { height, width } = sizeGhostElement;

		event.dataTransfer.setDragImage(customGhost.value, width / 2, height / 2);
		event.dataTransfer.effectAllowed = 'move';
	}
};

const onTouchStart = () => {
	isDragging = true;

	if (customGhost.value) {
		customGhost.value.style.opacity = '1';
	}
};

const onTouchMove = (event: TouchEvent) => {
	if (isDragging && customGhost.value) {
		const [touch] = event.touches;
		const { height, width } = sizeGhostElement;

		customGhost.value.style.left = `${touch.clientX - width / 2}px`;
		customGhost.value.style.top = `${touch.clientY - height / 2}px`;
		emit('drag');
	}
};

const onDragEnd = () => {
	if (isDragging) {
		isDragging = false;

		if (customGhost.value) {
			customGhost.value.style.left = '-9999px';
			customGhost.value.style.opacity = '0.9';
		}
		emit('drag-end');
	}
};

</script>

<template>
	<div>
		<div
			class="droppable"
			draggable="true"
			@dragstart="onDragStart"
			@drag="emit('drag')"
			@dragend="emit('drag-end')"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onDragEnd"
		>
			Droppable Element (Drag me!)
		</div>
		<div
			ref="customGhost"
			class="custom-ghost"
		>
			<ghost-component-base  :title="props.title" />
		</div>
	</div>
</template>

<style scoped>
.droppable {
	width: 150px;
	margin: 10px 0;
	padding: 10px;
	text-align: center;
	background-color: #ffdddd;
	border: 1px solid #000000;
	cursor: move;
	user-select: none;
}

.custom-ghost {
	position: absolute;
	left: -9999px;
	opacity: 0.9;
	pointer-events: none;
}
</style>
