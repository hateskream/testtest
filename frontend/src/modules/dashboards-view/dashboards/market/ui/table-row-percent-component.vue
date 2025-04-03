<script setup lang="ts">
import { computed, useCssModule } from 'vue';

const props = defineProps<{
	value: string;
}>();

const classes = useCssModule('classes');

const percentClasses = computed<string>(() => {
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
	<div :class="percentClasses">{{ value }}%</div>
</template>

<style module="classes">
.positive {
	color: rgb(178 242 211 / 100%);
}

.negative {
	color: rgb(255 175 106 / 100%);
}
</style>
