<script setup lang="ts">
import { GridItem } from 'grid-layout-plus';
import { useCssModule, computed, onBeforeUnmount, onMounted, ref } from 'vue';

interface IGridElement {
	i: number | string;
	x: number;
	y: number;
	w: number;
	h: number;
	isDnd: boolean;
}

const props = defineProps<IGridElement>();

const emit = defineEmits<{
	(event: 'is-drag'): void;
	(event: 'is-drag-end'): void;
}>();

const classes = useCssModule('classes');

const classListItem = computed(() => ({
	[classes.isDnd]: props.isDnd,
	[classes.notDnd]: !props.isDnd,
}));

const gridItemRef = ref<InstanceType<typeof GridItem> | null>(null);

let observer: MutationObserver | null = null;

onMounted(() => {
	if (!gridItemRef.value) {
		return;
	}

	const element = gridItemRef.value.$el;

	observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.attributeName === 'class') {
				const isDragging = element.classList.contains('vgl-item--dragging');

				if (isDragging) {
					emit('is-drag');
				} else {
					emit('is-drag-end');
				}
			}
		});
	});

	observer.observe(element, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => {
	if (observer) {
		observer.disconnect();
	}
});
</script>

<template>
	<grid-item
		:key="props.i"
		ref="gridItemRef"
		:x="props.x"
		:y="props.y"
		:w="props.w"
		:h="props.h"
		:i="props.i"
	>
		<div :class="[classes.itemWrapper, classListItem]">
			<slot />
		</div>
	</grid-item>
</template>

<style module="classes">
:global(.vgl-item:not(.vgl-item--placeholder)) {
	user-select: none;
}

:global(.vgl-item--placeholder .vgl-item__resizer) {
	display: none !important;
}

:global(.vgl-item__resizer) {
	right: 15px !important;
	bottom: 10px !important;
	background-color: #000000 !important;
}

:global(.vgl-item--placeholder) {
	background-color: rgb(0 128 255 / 80%) !important;
	border: 7px solid #000000 !important;
	border-radius: 18px;
	opacity: 0.1 !important;
}

.isDnd {
	padding: 7px;
}

.notDnd {
	padding: 3px;
}

.content {
	margin: 0 16px 18px;
}

.item {
	width: 100%;
	height: 100%;
}

.itemWrapper {
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	transition: padding 0.3s ease;
}
</style>
