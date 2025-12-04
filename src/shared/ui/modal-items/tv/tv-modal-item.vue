<script setup lang="ts">
</script>

<template>
	<div :class="classes.item">
		<slot name="default" />
	</div>
</template>

<style module="classes">
.item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	font-style: normal;
	font-weight: 300;
	font-size: var(--typography-menu-menu-item, 12px);
	line-height: 150%;
	color: var(--color-text-base-500, #ffffff);
	border-radius: 20px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	padding-inline: 12px;
}

.item:hover {
	background-color: var(--bg-color-surface-01-effect);
}
</style>
