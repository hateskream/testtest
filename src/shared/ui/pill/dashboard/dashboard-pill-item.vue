<script setup lang="ts">
const model = defineModel<boolean>();
</script>

<template>
	<div :class="[classes.pill, model && classes.active]" data-pill-item>
		<slot />
	</div>
</template>

<style module="classes">
.pill {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 28px;
	padding: 0 12px;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.122px;
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s9-16, 6px);
	cursor: pointer;
	gap: 3px;
}

.active {
	color: var(--color-text-base-500, #ffffff);
	background: var(--bg-500, rgb(73 73 80 / 90%));
}
</style>
