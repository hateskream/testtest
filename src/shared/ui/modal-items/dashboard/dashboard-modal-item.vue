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
	align-items: center;
	width: 100%;
	height: 36px;
	min-height: 36px;
	padding: 0 10px;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-300-r-size, 13.3px);
	line-height: 180%;
	color: var(--color-text-base-500, #ffffff);
	letter-spacing: 0.146px;
	border-radius: var(--radius-radius-s14-32, 12.4px);
	user-select: none;
}

.item:hover {
	background: var(--color-metrics-bg-control-300, rgb(45 45 47 / 40%));
}
</style>
