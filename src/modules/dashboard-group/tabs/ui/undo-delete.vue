<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const emit = defineEmits(['undo']);
</script>

<template>
	<div :class="classes.container">
		<ui-text token="title-100" :class="classes.deletedText">Deleted</ui-text>
		<button
			class="title-100"
			:class="classes.undoButton"
			@click="emit('undo')"
		>
			Undo
		</button>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 160px;
	height: 56px;
	background-color: #dcdcdf;
	border-radius: 12px;
	gap: 6px;
}

.deletedText {
	color: var(--color-text-contrast-300, #5c5c66);
}

.undoButton {
	padding: 4px 14px;
	color: var(--color-text-base-300, #9a9a9d);
	background: transparent;
	border: 1px solid rgb(97 97 97 / 30%);
	border-radius: 20px;
	cursor: pointer;
	transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.undoButton:hover {
	background: #d8d8d8;
	border-color: #999999;
}
</style>
