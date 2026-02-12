<script setup lang="ts">
</script>

<template>
	<div :class="classes.content">
		<slot />
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	min-width: 0;
	padding: var(--padding-padding-s5, 8px) 0;
	gap: var(--padding-padding-s5, 8px);
}
</style>
