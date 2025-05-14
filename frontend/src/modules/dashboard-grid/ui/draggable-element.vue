<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
}>();

const INIT_LEFT = '-9999px';
const INIT_OPACITY = '0.9';

const sizeGhostElement = {
	centerHeight: 0,
	centerWidth: 0,
}

let isDragging = false;

const customGhost = ref<HTMLDivElement | null>(null);

onMounted(() => {
	if (customGhost.value) {
		sizeGhostElement.centerHeight = customGhost.value.clientHeight / 2;
		sizeGhostElement.centerWidth = customGhost.value.clientWidth / 2;
	}
})

function onDragStart(event: DragEvent) {
	if (event.dataTransfer && customGhost.value) {
		const { centerHeight, centerWidth } = sizeGhostElement;

		event.dataTransfer.setDragImage(customGhost.value, centerWidth, centerHeight);
		event.dataTransfer.effectAllowed = 'move';
	}
};

function onTouchStart() {
	isDragging = true;

	if (customGhost.value) {
		customGhost.value.style.opacity = '1';
	}
};

function onTouchMove(event: TouchEvent) {
	if (isDragging && customGhost.value) {
		const [touch] = event.touches;
		const { centerHeight, centerWidth } = sizeGhostElement;

		customGhost.value.style.left = `${touch.clientX - centerWidth}px`;
		customGhost.value.style.top = `${touch.clientY - centerHeight}px`;
		emit('drag');
	}
};

function onDragEnd() {
	if (isDragging) {
		isDragging = false;

		if (customGhost.value) {
			customGhost.value.style.left = INIT_LEFT;
			customGhost.value.style.opacity = INIT_OPACITY;
		}
		emit('drag-end');
	}
};

</script>

<template>
	<div>
		<div
			:class="classes.droppable"
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
			:class="classes.customGhost"
		>
			<slot />
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
	cursor: move;
	user-select: none;
}

.customGhost {
	position: absolute;
	left: v-bind(INIT_LEFT);
	opacity: v-bind(INIT_OPACITY);
	pointer-events: none;
}
</style>
