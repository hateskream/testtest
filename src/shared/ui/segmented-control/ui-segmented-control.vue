<script setup lang="ts">
// Figma component: segmented-control
import { createSegmentedControlContext } from './use-segmented-control-context';
import type { SegmentedControlModel } from './model';

const modelValue = defineModel<SegmentedControlModel>();

function select(value: SegmentedControlModel | undefined) {
	modelValue.value = value;
}

createSegmentedControlContext({
	select,
	active: modelValue,
});
</script>

<template>
	<div :class="classes.container">
		<slot />
	</div>
</template>

<style module="classes">
.container {
	position: relative;
	display: flex;
	flex: 1 0 0;
	align-items: center;
	gap: var(--padding-s1, 1px);
}
</style>
