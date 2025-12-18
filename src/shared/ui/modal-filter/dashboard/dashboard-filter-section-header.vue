<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

defineProps<{
	isActive?: boolean;
}>();
</script>

<template>
	<div :class="classes.top">
		<ui-text token="text-200-r" :class="[classes.rowTitle, !isActive && classes.disabled]">
			<slot />
		</ui-text>

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
	color: var(--color-text-active-base-300-active, #ffffff);
	gap: 8px;
	transition: color 0.12s ease-in-out;
}

.disabled {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
