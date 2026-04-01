<script setup lang="ts">
// Figma component: tag
import { computed } from 'vue';

import { UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import type { IUiTagProps } from './types';

const props = withDefaults(defineProps<IUiTagProps>(), {
	icon: null,
	iconSize: 6,
	iconPosition: 'end',
	color: 'neutral',
});

const isReversed = computed(() => props.iconPosition === 'start');
</script>

<template>
	<div :class="[classes.tag, classes[props.color], { [classes.reversed]: isReversed }]">
		<ui-text
			v-if="$slots.default"
			token="text-200-r"
			:class="classes.text"
		>
			<slot />
		</ui-text>
		<slot name="icon">
			<ui-icon
				v-if="props.icon"
				:id="props.icon"
				:height="props.iconSize"
				:width="props.iconSize"
			/>
		</slot>
	</div>
</template>

<style module="classes">
.tag {
	display: inline-flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding: var(--tile-padding-md-gap, 3px) var(--tile-padding-md-out, 6px);
	border-radius: var(--radius-radius-s9-16, 6px);
	gap: var(--tile-padding-md-gap, 3px);
}

.tag.neutral {
	color: var(--text-500, rgb(255 255 255 / 96%));
	background-color: var(--base-base-80, rgb(73 73 80 / 22%));
}

.tag.positive {
	color: var(--success-success-00, #04eda0);
	background-color: var(--success-success-90, rgb(4 237 160 / 10%));
}

.tag.negative {
	color: var(--warning-warning-00, #fc1d4d);
	background-color: var(--warning-success-90, rgb(252 29 77 / 10%));
}

.tag.reversed {
	flex-direction: row-reverse;
}

.text {
	line-height: 1;
}
</style>
