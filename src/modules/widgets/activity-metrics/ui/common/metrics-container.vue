<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';
import { TickerIconTooltip } from '@/modules/ticker/ui/base';

const props = defineProps<{
	title: string;
	tooltip?: string;
}>();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<ui-text token="text-100-r">
				{{ props.title }}
			</ui-text>
			<ticker-icon-tooltip v-if="props.tooltip">
				{{ props.tooltip }}
			</ticker-icon-tooltip>
		</div>
		<ui-clamped
			:rows="1"
			:class="classes.content"
		>
			<ui-text token="title-200">
				<slot />
			</ui-text>
		</ui-clamped>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--padding-s5, 8px) var(--padding-s11, 20px);
	background-color: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: var(--radius-s14-32, 12.4px);
	gap: var(--padding-s2, 2px);
}

.header {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: var(--padding-s2, 3px);
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.content {
	padding: var(--padding-s2, 2px) 0;
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
