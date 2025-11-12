<script setup lang="ts">
import { nextTick, onMounted, reactive, useTemplateRef, watch } from 'vue';

import { provideSegmentedControl } from '@/shared/ui/segmented-control/composables/use-segmented-control.ts';

const props = defineProps<{
	modelValue: string | number;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number): void;
}>();

const containerRef = useTemplateRef('container');
const slider = reactive({ left: 0, width: 0 });

function updateSlider() {
	const el = containerRef.value?.querySelector(`[data-value="${props.modelValue}"]`) as HTMLElement | null;
	if (!el) {
		return;
	}

	const { offsetLeft, offsetWidth } = el;
	slider.left = offsetLeft;
	slider.width = offsetWidth;
}

provideSegmentedControl({
	select: value => emit('update:modelValue', value),
	getValue: () => props.modelValue,
});

watch(() => props.modelValue, () => {
	nextTick(updateSlider);
});

onMounted(() => {
	nextTick(updateSlider);
});
</script>

<template>
	<div ref="container" :class="classes.container">
		<div
			:class="classes.slider"
			:style="{ width: slider.width + 'px', transform: `translateX(${slider.left}px)` }"
		/>
		<slot />
	</div>
</template>

<style module="classes">
.container {
	position: relative;
	display: flex;
	flex: 1 0 0;
	align-items: center;
	max-width: 200px;
	padding: 2px;
	background: var(--color-bg-base-300, rgb(37 37 39 / 50%));
	border-radius: var(--radius-full, 9999px);
	gap: 2px;
}

.slider {
	position: absolute;
	top: 2px;
	bottom: 2px;
	left: 0;
	background: rgb(51 51 51 / 80%);
	border-radius: 9999px;
	transition: transform 0.25s ease, width 0.25s ease;
	pointer-events: none;
}
</style>
