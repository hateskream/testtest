<script setup lang="ts">
import { UiModalWrapper } from '@/shared/ui/modal';
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<ui-modal-wrapper :class="classes.wrapper" display-variant="new">
		<ui-text token="text-200-r" :class="classes.text">
			<span>Drag</span> to reorder
		</ui-text>
		<ui-text token="text-200-r" :class="classes.text">
			<span>Click</span> to jump to
		</ui-text>
	</ui-modal-wrapper>
</template>

<style module="classes">
.wrapper {
	min-width: unset;
	padding: 8px 10px;
	border-radius: 12.4px;
	gap: 2px;
	pointer-events: none;
}

.text {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.text span {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
