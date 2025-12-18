<script setup lang="ts">
defineProps<{
	isActive?: boolean;
}>();
</script>

<template>
	<div :class="classes.top">
		<span :class="[classes.rowTitle, !isActive && classes.disabled]">
			<slot />
		</span>

		<slot name="right" />
	</div>
</template>

<style module="classes">
.top {
	display: flex;
	flex: 1 0 0;
	justify-content: space-between;
	align-items: center;
	height: var(--height-height-s15, 36px);
	padding: 10px 0;
	border-radius: var(--radius-02, 12px);
}

.rowTitle {
	display: flex;
	align-items: flex-start;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--color-text-active-base-300-active, #ffffff);
	letter-spacing: 0.122px;
	gap: 8px;
	transition: color 0.12s ease-in-out;
}

.disabled {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
