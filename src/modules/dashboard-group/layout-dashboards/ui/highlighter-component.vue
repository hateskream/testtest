<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
	duration?: number;
}>(), {
	duration: 700,
});

const flash = ref(false);

async function trigger() {
	flash.value = false;

	await new Promise<void>(resolve => {
		requestAnimationFrame(() => resolve());
	});

	flash.value = true;

	await new Promise<void>(resolve => {
		setTimeout(resolve, props.duration);
	});

	flash.value = false;
}

defineExpose({ trigger });
</script>

<template>
	<div :class="[classes.flash, flash && classes.active]" :style="`--ms: ${props.duration}ms`" />
</template>

<style module="classes">
.flash {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 10;
	border-radius: 12px;
	pointer-events: none;
	touch-action: none;
}

.flash.active {
	animation: widget-flash var(--ms) ease-out;
}

@keyframes widget-flash {
	0% {
		background-color: transparent;
	}

	20% {
		background-color: rgb(255 255 255 / 25%);
	}

	100% {
		background-color: transparent;
	}
}
</style>
