<script setup lang="ts">
// Figma component: legend
</script>

<template>
	<div :class="classes.legend">
		<slot />
	</div>
</template>

<style module="classes">
@layer kit {
	.legend {
		display: flex;
		align-items: center;
		padding: var(--padding-s7, 12px) var(--padding-s11, 20px);
		border-top: 1px solid var(--border-100, rgb(73 73 80 / 44%));
	}
}
</style>
