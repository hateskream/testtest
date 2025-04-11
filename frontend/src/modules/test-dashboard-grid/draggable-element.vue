<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
}>();

const customGhost = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const touchStartX = ref(0);
const touchStartY = ref(0);

const onDragStart = (event: DragEvent) => {
	if (event.dataTransfer && customGhost.value) {
		event.dataTransfer.setDragImage(customGhost.value, 25, 25);
		event.dataTransfer.effectAllowed = 'move';
	}
};

const onTouchStart = (event: TouchEvent) => {
	isDragging.value = true;

	const touch = event.touches[0];
	touchStartX.value = touch.clientX;
	touchStartY.value = touch.clientY;

	if (customGhost.value) {
		customGhost.value.style.display = 'block';
		customGhost.value.style.left = `${touch.clientX - 100}px`;
		customGhost.value.style.top = `${touch.clientY - 100}px`;
	}
};

const onTouchMove = (event: TouchEvent) => {
	if (isDragging.value && customGhost.value) {
		const touch = event.touches[0];
		customGhost.value.style.left = `${touch.clientX}px`;
		customGhost.value.style.top = `${touch.clientY}px`;
		emit('drag');
	}
};

const onDragEnd = () => {
	if (isDragging.value) {
		isDragging.value = false;
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
			Drag
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
	user-select: none; /* Запрещаем выделение текста */
}

.custom-ghost {
	position: absolute;
	left: -99999px;
	width: 50px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	color: #ffffff;
	background-color: #ff4444;
	border-radius: 50%;
	opacity: 0.9;
	transition: opacity 0.3s ease;
}
</style>
