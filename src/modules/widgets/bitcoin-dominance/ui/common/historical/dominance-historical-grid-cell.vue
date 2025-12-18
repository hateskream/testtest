<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<ui-text
		:class="classes.cell"
		token="text-50-r"
		as="div"
	>
		<slot />
	</ui-text>
</template>

<style module="classes">
.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 6px;
	color: var(--text-color-base-300);
}
</style>
