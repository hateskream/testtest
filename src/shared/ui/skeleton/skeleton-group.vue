<script setup lang="ts">
import SkeletonComponent from './skeleton-component.vue';

const opacityValues = [1, 0.6, 0.3];
</script>

<template>
	<div :class="classes.root">
		<skeleton-component
			v-for="(opacity, index) in opacityValues"
			:key="index"
			:opacity="opacity"
			height="64px"
			border-radius="16px"
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
