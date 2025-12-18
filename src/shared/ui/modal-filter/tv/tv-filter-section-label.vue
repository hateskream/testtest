<script setup lang="ts">
defineProps<{
	isActive?: boolean;
}>();
</script>

<template>
	<div :class="[classes.rowTitle, isActive && classes.titleActive]">
		<slot />
	</div>
</template>

<style module="classes">
.rowTitle {
	min-width: 118px;
	padding: 4px 0;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
	transition: color 0.12s ease-in-out;
}

.titleActive {
	color: var(--text-color-base-300-activated);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
