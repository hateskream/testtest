<script setup lang="ts">
import { UiModalWrapper } from '@/shared/ui/modal';
</script>

<template>
	<ui-modal-wrapper :class="classes.wrapper" display-variant="new">
		<p><b>Drag</b> to reorder</p>
		<p><b>Click</b> to jump to</p>
	</ui-modal-wrapper>
</template>

<style module="classes">
.wrapper {
	min-width: unset !important;
	padding: 12px;
}
</style>
