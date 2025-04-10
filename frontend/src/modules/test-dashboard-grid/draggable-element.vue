<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
}>();

const customGhost = ref<HTMLElement | null>(null);
const isDragging = ref(false); // Флаг для отслеживания состояния перетаскивания
const touchStartX = ref(0); // Начальная позиция касания по X
const touchStartY = ref(0); // Начальная позиция касания по Y

// Обработчик начала перетаскивания
const onDragStart = (event: DragEvent | TouchEvent) => {
	if ('dataTransfer' in event && event.dataTransfer && customGhost.value) {
		// Для desktop
		event.dataTransfer.setDragImage(customGhost.value, 25, 25);
		event.dataTransfer.effectAllowed = 'move';
	} else if ('touches' in event) {
		// Для mobile
		isDragging.value = true;
		const touch = event.touches[0];
		touchStartX.value = touch.clientX;
		touchStartY.value = touch.clientY;

		// Создаем кастомный "ghost" элемент для мобильных устройств
		if (customGhost.value) {
			customGhost.value.style.display = 'block';
			customGhost.value.style.left = `${touch.clientX - 100}px`;
			customGhost.value.style.top = `${touch.clientY - 100}px`;
		}
	}
};

// Обработчик движения
const onDragMove = (event: TouchEvent) => {
	if (isDragging.value && customGhost.value) {
		const touch = event.touches[0];
		customGhost.value.style.left = `${touch.clientX}px`;
		customGhost.value.style.top = `${touch.clientY}px`;
		emit('drag');
	}
};

// Обработчик завершения перетаскивания
const onDragEnd = () => {
	if (isDragging.value) {
		isDragging.value = false;
		if (customGhost.value) {
			customGhost.value.style.display = 'none'; // Скрываем ghost элемент
		}
		emit('drag-end');
	}
};
</script>

<template>
	<div>
		<!-- Основной перетаскиваемый элемент -->
		<div
			class="droppable"
			draggable="true"
			@dragstart="onDragStart"
			@drag="emit('drag')"
			@dragend="emit('drag-end')"
			@touchstart="onDragStart"
			@touchmove="onDragMove"
			@touchend="onDragEnd"
		>
			Droppable Element (Drag me!)
		</div>

		<!-- Кастомный ghost элемент -->
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
	position: absolute; /* Убираем из потока */
	display: none; /* По умолчанию скрыт */
	width: 50px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	color: white;
	background-color: #ff4444;
	border-radius: 50%;
	opacity: 0.9; /* Делаем видимым для setDragImage */
	transition: opacity 0.3s ease; /* Плавное исчезновение */
}
</style>
