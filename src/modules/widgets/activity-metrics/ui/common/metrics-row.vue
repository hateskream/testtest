<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	title: string;
}>();
</script>

<template>
	<div :class="classes.row">
		<ui-text :class="classes.title" token="text-100-r">
			{{ props.title }}
		</ui-text>
		<div>
			<slot />
		</div>
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px);
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: var(--radius-s14-32, 12.4px);
	gap: var(--padding-s2, 2px);
}

.title {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
