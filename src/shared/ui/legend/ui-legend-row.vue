<script setup lang="ts"></script>

<template>
	<div :class="classes.legendRow">
		<slot />
	</div>
</template>

<style module="classes">
@layer kit {
	.legendRow {
		display: flex;
		align-items: center;
		gap: var(--padding-s14, 32px);
	}
}
</style>
