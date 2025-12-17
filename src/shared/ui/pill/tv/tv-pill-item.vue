<script setup lang="ts">
const model = defineModel<boolean>();
</script>

<template>
	<div class="title-100" :class="[classes.pill, model && classes.active]">
		<slot />
	</div>
</template>

<style module="classes">
.pill {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px 12px;
	color: var(--color-text-base-300, #9a9a9d);
	background: var(--color-bg-base-300, rgb(37 37 39 / 50%));
	border-radius: var(--radius-full, 9999px);
	cursor: pointer;
	gap: 6px;
	user-select: none;
}

.active {
	color: var(--color-text-base-500, #ffffff);
	background: var(--color-bg-active-base-300-active, rgb(51 51 51 / 80%));
}
</style>
