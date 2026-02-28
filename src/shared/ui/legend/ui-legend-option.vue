<script setup lang="ts">
// Figma component: legend-option
import type { ILegendOption } from './types';
import { UiText } from '@/shared/ui/text';

import UiLegendOptionHint from './ui-legend-option-hint.vue';

const props = defineProps<ILegendOption>();
</script>

<template>
	<div :class="classes.legendOption">
		<ui-legend-option-hint :color="props.color" :border="props.hint?.border" />
		<ui-text token="text-100-r">
			<slot>{{ props.label }}</slot>
		</ui-text>
	</div>
</template>

<style module="classes">
@layer kit {
	.legendOption {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--padding-s3, 4px);
		color: var(--text-300, rgb(255 255 255 / 62%));
	}
}
</style>
