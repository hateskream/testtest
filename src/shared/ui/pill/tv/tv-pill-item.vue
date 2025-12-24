<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const model = defineModel<boolean>();
</script>

<template>
	<ui-text token="text-300-r" :class="[classes.pill, model && classes.active]">
		<slot />
	</ui-text>
</template>

<style module="classes">
.pill {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4px 12px;
	color: var(--color-text-base-300, #9a9a9d);
	background: var(--color-bg-base-300, rgb(37 37 39 / 50%));
	border-radius: var(--radius-full, 9999px);
	cursor: pointer;
	gap: 3px;
	user-select: none;
}

.active {
	color: var(--color-text-base-500, #ffffff);
	background: var(--color-bg-active-base-300-active, rgb(51 51 51 / 80%));
}
</style>
