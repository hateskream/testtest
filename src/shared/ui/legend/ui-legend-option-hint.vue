<script setup lang="ts">
import type { ILegendOptionHint } from './types';

const props = defineProps<ILegendOptionHint>();
</script>

<template>
	<div
		:class="classes.hint"
		:style="{ backgroundColor: props.color, border: props.border }"
	></div>
</template>

<style module="classes">
@layer kit {
	.hint {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}
}
</style>
