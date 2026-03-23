<script setup lang="ts">
// Figma component: widget-label
import type { IWidgetLabelProps } from './types';
import { UiText } from '@/shared/ui/text';

const props = defineProps<IWidgetLabelProps>();
</script>

<template>
	<div :class="[classes.widgetLabel, { [classes.active]: props.active, [classes.disabled]: props.disabled }]">
		<ui-text :class="classes.text" token="text-200-r">
			<slot />
		</ui-text>
	</div>
</template>

<style module="classes">
@layer kit {
	.widgetLabel {
		display: inline-flex;
		align-items: center;
		height: var(--height-s12, 24px);
		padding: var(--padding-s3, 4px) var(--padding-s4, 6px);
		color: var(--text-500, rgb(255 255 255 / 96%));
		border-radius: var(--radius-s12-24, 9.2px);
		gap: var(--padding-s3, 4px);
		transition: background-color 0.2s ease-in-out;
	}

	.text {
		line-height: 1;
	}

	.widgetLabel:not(.disabled):hover {
		background-color: var(--base-50, rgb(73 73 80 / 52%));
	}

	.widgetLabel:not(.disabled).active {
		background-color: var(--bg-500, rgb(73 73 80 / 70%));
	}
}
</style>
