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
				const isChanging =
					element.classList.contains('vgl-item--dragging') ||
					element.classList.contains('vgl-item--resizing');

				if (isChanging) {
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
.isDnd {
	padding: 7px;
}

.notDnd {
	padding: 3px;
}

.itemWrapper {
	height: 100%;
	transition: padding 0.3s ease;
}
</style>
