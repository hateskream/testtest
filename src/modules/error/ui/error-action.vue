<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	variant: 'primary' | 'secondary';
	disabled?: boolean;
}>();
</script>

<template>
	<button :class="[classes.action, props.variant === 'primary' ? classes.primary : classes.secondary]" :disabled>
		<slot name="icon" />
		<ui-text token="text-300-b">
			<slot />
		</ui-text>
	</button>
</template>

<style module="classes">
.action {
	display: flex;
	flex: 1 0 0;
	justify-content: center;
	align-items: center;
	max-width: 215px;
	height: var(--height-s17, 44px);
	min-height: var(--control-xl-min-heigh, 42px);
	padding: 0 var(--control-xl-padding-text-l-r, 18px);
	border-radius: var(--radius-s17-44, 17.2px);
	gap: var(--control-xl-gap, 6px);
	transition: background-color 0.2s ease-in-out;
}

.action:not(:disabled) {
	cursor: pointer;
}

.action.primary {
	color: var(--atom-dark-00, #050505);
	background-color: var(--atom-contrast-00, #ffffff);

	&:hover:not(:disabled) {
		background-color: var(--atom-contrast-00, #dfdfdf);
	}
}

.action.secondary {
	color: var(--text-main, #ffffff);
	background-color: var(--bg-100, rgb(73 73 80 / 32%));

	&:hover:not(:disabled) {
		background-color: var(--bg-300, rgb(73 73 80 / 52%));
	}
}

.action:disabled {
	opacity: 0.5;
}
</style>
