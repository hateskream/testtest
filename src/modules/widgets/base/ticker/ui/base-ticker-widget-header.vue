<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<div :class="classes.header">
		<ui-text token="text-200-r" :class="classes.text">
			<slot />
		</ui-text>

		<slot name="right" />
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	align-items: center;
	align-self: stretch;
	height: 40px;
	padding:
		var(--padding-padding-s4, 6px) var(--padding-padding-s7, 12px)
		var(--padding-padding-s4, 6px) var(--padding-padding-s8, 14px);
	gap: var(--padding-padding-s3, 4px);
}

.text {
	padding: var(--padding-padding-s3, 4px) var(--padding-padding-s4, 6px);
}
</style>
