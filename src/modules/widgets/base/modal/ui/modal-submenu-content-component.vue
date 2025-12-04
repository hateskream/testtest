<script setup lang="ts">
import { TvModalContent } from '@/shared/ui/modal';
</script>

<template>
	<tv-modal-content :class="classes.submenu">
		<slot name="content" />
	</tv-modal-content>
</template>

<style module="classes">
.submenu {
	min-width: 204px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
