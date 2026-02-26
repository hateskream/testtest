<script setup lang="ts">
</script>

<template>
	<div :class="classes.chip" class="text-200-r">
		<slot />
	</div>
</template>

<style module="classes">
.chip {
	display: inline-flex;
	align-items: center;
	height: var(--height-s12, 24px);
	padding: var(--padding-s3, 4px) var(--padding-s6, 10px) var(--padding-s3, 4px) var(--tile-padding-md-in, 10px);
	color: var(--text-300, rgb(255 255 255 / 60%));
	background-color: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-s12-24, 9.2px);
	cursor: pointer;
	transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
	gap: var(--padding-s3, 4px);
}

.chip:hover {
	color: var(--text-500, rgb(255 255 255 / 96%));
	background-color: var(--base-50, rgb(73 73 80 / 52%));
}

.chip:active {
	color: var(--text-500, rgb(255 255 255 / 96%));
	background-color: var(--bg-500, rgb(73 73 80 / 90%));
}

.chip:active:hover {
	color: var(--text-500, rgb(255 255 255 / 96%));
	background-color: var(--base-40, rgb(73 73 80 / 60%));
}
</style>
