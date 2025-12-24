<script setup lang="ts">
import { useProvideDisplayVariant } from '@/shared/ui/modal';

useProvideDisplayVariant('default');
</script>

<template>
	<div :class="classes.container">
		<slot />
	</div>
</template>

<style module="classes">
.container {
	box-sizing: border-box;
	width: max-content;
	min-width: 208px;
	max-height: 80svh;
	padding: 0;
	overflow: hidden;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
	scrollbar-gutter: stable;
}
</style>
