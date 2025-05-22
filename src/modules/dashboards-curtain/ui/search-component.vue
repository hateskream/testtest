<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
</script>

<template>
	<div :class="classes.root">
		<ui-icon
			:id="IconIds.Search"
			width="20px"
			height="20px"
			:class="classes.icon"
		/>
		<input
			type="text"
			placeholder="Press / and start typing"
			:class="classes.input"
		/>
		<div :class="classes.line" />
	</div>
</template>

<style module="classes">
.root {
	position: relative;
}

.icon {
	position: absolute;
	top: 12px;
	color: var(--icon-color-base-300);
	transform: translateY(-50%);
	cursor: pointer;
}

.input {
	width: 100%;
	padding: 0 8px 12px 24px;
	font-size: 14px;
	text-align: left;
	color: var(--icon-color-base-300);
	background: transparent;
	border: none;
	outline: none;
}

.input::placeholder {
	text-align: left;
	color: var(--icon-color-base-300);
	opacity: 1;
	transition: opacity 0.2s ease;
}

.input:focus::placeholder {
	opacity: 0;
}

.line {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 1px;
	background-color: rgb(255 255 255 / 12%);
}
</style>
