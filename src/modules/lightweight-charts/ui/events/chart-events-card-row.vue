<script setup lang="ts">

import { UiText } from '@/shared/ui/text';

interface IProps {
	name: string;
	value: string;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.row">
		<ui-text token="text-200-r">{{ props.name }}</ui-text>
		<ui-text token="text-200-b">{{ props.value }}</ui-text>
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	justify-content: space-between;
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
