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

const cuurentItemDnd = ref(false);

let observer: MutationObserver | null = null;

onMounted(() => {
	if (!gridItemRef.value) {
		return;
	}

	const element = gridItemRef.value.$el as HTMLElement;

	observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.attributeName === 'class') {
				const isResizing = element.classList.contains('vgl-item--resizing');
				const isDragging = element.classList.contains('vgl-item--dragging');

				if (isDragging) {
					cuurentItemDnd.value = true;
				} else {
					cuurentItemDnd.value = false;
				}

				if (isResizing || isDragging) {
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
			<div
				v-if="!cuurentItemDnd"
				:class="classes.item"
			>
				<slot name="not-dnd" />
			</div>
			<div
				v-if="cuurentItemDnd"
				:class="classes.item"
			>
				<slot name="dnd" />
			</div>
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

.item {
	width: 100%;
	height: 100%;
}
</style>
