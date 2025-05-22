<script setup lang="ts">
import { computed, useCssModule } from 'vue';

interface IProps {
	value: string;
}

const props = defineProps<IProps>();

const classes = useCssModule('classes');

const percentClasses = computed<string>(() => {
	if (+props.value === 0) {
		return classes.positive;
	}

	if (+props.value > 0) {
		return classes.positive;
	}

	if (+props.value < 0) {
		return classes.negative;
	}

	return '';
});
</script>

<template>
	<div :class="[percentClasses, classes.percent]">{{ value }}%</div>
</template>

<style module="classes">
.commonly {
	color: var(--text-color-base-300);
}

.positive {
	color: var(--metrics-color-positive);
}

.negative {
	color: var(--metrics-color-negative-500);
}
</style>
