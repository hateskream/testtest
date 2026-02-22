<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { useResizeObserver } from '@vueuse/core';

import type { IScrollFadeProps } from './types.ts';

const props = withDefaults(defineProps<IScrollFadeProps>(), {
	size: 24,
	direction: 'vertical',
});

const root = useTemplateRef('root');

const hasStartFade = ref(false);
const hasEndFade = ref(false);

let frame = 0;

function measure() {
	const el = root.value;
	if (!el || props.disabled) {
		return;
	}

	if (props.direction === 'vertical') {
		const { scrollTop, scrollHeight, clientHeight } = el;
		const overflow = scrollHeight > clientHeight + 1;

		if (!overflow) {
			hasStartFade.value = false;
			hasEndFade.value = false;
			return;
		}

		hasStartFade.value = scrollTop > 1;
		hasEndFade.value =
			scrollTop + clientHeight < scrollHeight - 1;

		return;
	}

	const { scrollLeft, scrollWidth, clientWidth } = el;
	const overflow = scrollWidth > clientWidth + 1;

	if (!overflow) {
		hasStartFade.value = false;
		hasEndFade.value = false;
		return;
	}

	hasStartFade.value = scrollLeft > 1;
	hasEndFade.value =
			scrollLeft + clientWidth < scrollWidth - 1;
}

function scheduleMeasure() {
	cancelAnimationFrame(frame);
	frame = requestAnimationFrame(measure);
}

useResizeObserver(root, scheduleMeasure);

onMounted(scheduleMeasure);

onBeforeUnmount(() => {
	cancelAnimationFrame(frame);
});

const sizeInPx = computed(() => `${props.size}px`);

const start = computed(() => hasStartFade.value ? 'transparent' : '#000');
const end = computed(() => hasEndFade.value ? 'transparent' : '#000');

const gradientDirection = computed(() => props.direction === 'vertical' ? 'bottom' : 'right');
</script>

<template>
	<div
		ref="root"
		:class="[
			classes.scrollFade,
			{
				[classes.disabled]: props.disabled,
				[classes.fade]: hasStartFade || hasEndFade
			}
		]"
		@scroll.passive="scheduleMeasure"
	>
		<slot />
	</div>
</template>

<style module="classes">
@layer kit {
	.scrollFade {
		overflow: auto;
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
		mask-composite: intersect;
		overscroll-behavior: auto;
	}

	.scrollFade:not(.disabled).fade {
		mask-image:
			linear-gradient(
				to v-bind(gradientDirection),
				v-bind(start) 0,
				#000000 v-bind(sizeInPx),
				#000000 calc(100% - v-bind(sizeInPx)),
				v-bind(end) 100%
			);
	}
}
</style>
