<script setup lang="ts">
const opacityValues = [1, 0.6, 0.3];
</script>

<template>
	<div :class="classes.root">
		<ui-skeleton
			v-for="(opacity, index) in opacityValues"
			:key="index"
			:opacity="opacity"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
