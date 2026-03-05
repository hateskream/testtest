<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<div :class="classes.cell">
		<ui-text token="text-200-r">
			<slot />
		</ui-text>
	</div>
</template>

<style module="classes">
.cell {
	display: flex;
	flex: 1 0 0;
	justify-content: flex-start;
	align-items: center;
	width: auto;
	height: 30px;
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
