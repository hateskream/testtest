<script setup lang="ts">
import { UiWidgetLabel } from '@/shared/ui/widget-label';

interface IBaseTickerWidgetHeaderProps {
	disabled?: boolean;
}

const props = defineProps<IBaseTickerWidgetHeaderProps>();
</script>

<template>
	<div :class="classes.header">
		<slot name="label">
			<ui-widget-label :disabled="props.disabled">
				<slot />
			</ui-widget-label>
		</slot>
		<slot name="right" />
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	height: 40px;
	padding:
		var(--padding-padding-s4, 6px) var(--padding-padding-s7, 12px)
		var(--padding-padding-s4, 6px) var(--padding-padding-s8, 14px);
	gap: var(--padding-padding-s3, 4px);
}
</style>
