<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
</script>

<template>
	<div :class="classes.header">
		<ui-text token="title-200">
			<slot />
		</ui-text>

		<slot name="right" />
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	align-items: center;
	box-sizing: border-box;
	width: 100%;
	padding: var(--padding-padding-s7, 12px) var(--padding-padding-s11, 20px);
	background: linear-gradient(180deg, #1b1b1d 67.21%, rgb(28 28 30 / 16%) 94.56%, rgb(30 30 32 / 0%) 100%);
	gap: var(--padding-padding-s7, 12px);
}
</style>
