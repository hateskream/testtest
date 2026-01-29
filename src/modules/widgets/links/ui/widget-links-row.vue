<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	title: string;
}>();
</script>

<template>
	<div :class="classes.row">
		<div :class="classes.left">
			<ui-text :class="classes.title" token="text-100-r">{{ props.title }}</ui-text>
		</div>
		<slot name="content" />
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: var(--padding-padding-s7, 12px);
	padding: var(--padding-s5, 8px) 0;
}

.left {
	flex-shrink: 0;
	width: 70px;
	height: var(--height-s12, 24px);
}

.title {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
