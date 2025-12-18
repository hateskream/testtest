<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const model = defineModel<boolean>();
</script>

<template>
	<ui-text
		:class="[classes.pill, model && classes.active]"
		as="div"
		token="text-200-r"
		data-pill-item
	>
		<slot />
	</ui-text>
</template>

<style module="classes">
.pill {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 28px;
	padding: 0 12px;
	color: var(--text-300, rgb(255 255 255 / 62%));
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
