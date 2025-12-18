<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

defineProps<{
	isActive?: boolean;
}>();
</script>

<template>
	<ui-text
		as="div"
		token="text-200-r"
		align="left"
		:class="[classes.rowTitle, isActive && classes.active]"
	>
		<slot />
	</ui-text>
</template>

<style module="classes">
.rowTitle {
	min-width: 118px;
	height: 32px;
	padding: 4px 0;
	overflow: hidden;
	color: var(--text-300, rgb(255 255 255 / 62%));
	text-overflow: ellipsis;
	transition: color 0.12s ease-in-out;
}

.active {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
