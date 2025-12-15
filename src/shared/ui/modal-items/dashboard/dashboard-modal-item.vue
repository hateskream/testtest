<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<ui-text
		:class="classes.item"
		token="text-300-r"
		as="div"
	>
		<slot />
	</ui-text>
</template>

<style module="classes">
.item {
	display: flex;
	align-items: center;
	width: 100%;
	height: 36px;
	min-height: 36px;
	padding: 0 10px;
	color: var(--color-text-base-500, #ffffff);
	border-radius: var(--radius-radius-s14-32, 12.4px);
	user-select: none;
}

.item:hover {
	background: var(--color-metrics-bg-control-300, rgb(45 45 47 / 40%));
}
</style>
