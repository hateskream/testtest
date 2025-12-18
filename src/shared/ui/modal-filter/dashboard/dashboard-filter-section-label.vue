<script setup lang="ts">
defineProps<{
	isActive?: boolean;
}>();
</script>

<template>
	<div :class="[classes.rowTitle, isActive && classes.active]">
		<slot />
	</div>
</template>

<style module="classes">
.rowTitle {
	min-width: 118px;
	height: 32px;
	padding: 4px 0;
	overflow: hidden;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	text-align: left;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.122px;
	text-overflow: ellipsis;
	transition: color 0.12s ease-in-out;
}

.active {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
