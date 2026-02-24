<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';

interface IUiClampedProps {
	rows?: number;
	as?: string;
}

const props = withDefaults(defineProps<IUiClampedProps>(), {
	rows: 3,
	as: 'div',
});

const root = useTemplateRef<HTMLElement>('root');

const isClamped = ref(false);

function measureClamp() {
	const element = root.value;
	if (element) {
		isClamped.value = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
	} else {
		isClamped.value = false;
	}
}

watch(() => props.rows, () => {
	nextTick(measureClamp);
});

let frameId: number | null = null;

useResizeObserver(root, () => {
	if (frameId !== null) {
		cancelAnimationFrame(frameId);
	}

	frameId = requestAnimationFrame(() => {
		measureClamp();
		frameId = null;
	});
});

onBeforeUnmount(() => {
	if (frameId !== null) {
		cancelAnimationFrame(frameId);
	}
});
</script>
<template>
	<component
		:is="props.as"
		ref="root"
		:class="classes.clamped"
	>
		<slot :is-clamped="isClamped" />
	</component>
</template>
<style module="classes">
.clamped {
	display: -webkit-box;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: v-bind(rows);
	line-clamp: v-bind(rows);
	-webkit-box-orient: vertical;
}
</style>
