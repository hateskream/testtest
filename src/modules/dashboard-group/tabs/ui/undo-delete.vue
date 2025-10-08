<script setup lang="ts">
const emit = defineEmits(['undo']);
</script>

<template>
	<div :class="classes.container">
		<span :class="classes.deletedText">Deleted</span>
		<button :class="classes.undoButton" @click="emit('undo')">Undo</button>
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
	font-style: normal;
	font-weight: 300;
	font-size: var(--typography-menu-menu-title, 13px);
	line-height: 22px;
	color: var(--color-text-contrast-300, #5c5c66);
	letter-spacing: 0.052px;
}

.undoButton {
	padding: 4px 14px;
	font-style: normal;
	font-weight: 440;
	font-size: var(--typography-headers-size-h-01, 13px);
	line-height: 22px;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.052px;
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
