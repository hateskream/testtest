<script setup lang="ts">
// Figma component: legend-option
import type { ILegendOption } from './types';
import { UiText } from '@/shared/ui/text';

const props = defineProps<ILegendOption>();
</script>

<template>
	<div :class="classes.legendOption">
		<div :class="classes.hint" :style="{ backgroundColor: props.color }"></div>
		<ui-text token="text-100-r">
			<slot>{{ props.label }}</slot>
		</ui-text>
	</div>
</template>

<style module="classes">
@layer kit {
	.legendOption {
		display: inline-flex;
		align-items: center;
		gap: var(--padding-s3, 4px);
	}

	.hint {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}
}
</style>
