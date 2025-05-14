<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
}>();

const INIT_LEFT = '-9999px';
const INIT_OPACITY = '0.9';

const ghostElementCenter = {
	centerHeight: 0,
	centerWidth: 0,
}

let isDragging = false;

const customGhost = ref<HTMLDivElement | null>(null);

onMounted(() => {
	if (customGhost.value) {
		ghostElementCenter.centerHeight = customGhost.value.clientHeight / 2;
		ghostElementCenter.centerWidth = customGhost.value.clientWidth / 2;
	}
})

function onDragStart(event: DragEvent) {
	if (event.dataTransfer && customGhost.value) {
		const { centerHeight, centerWidth } = ghostElementCenter;

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
		const { centerHeight, centerWidth } = ghostElementCenter;

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
			<slot name="content" />
		</div>
		<div
			ref="customGhost"
			:class="classes.customGhost"
		>
			<slot name="ghost" />
		</div>
	</div>
</template>

<style module="classes">
.droppable {
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
