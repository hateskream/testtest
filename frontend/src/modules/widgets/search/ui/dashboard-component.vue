<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.inputWrapper">
			<ui-icon
				:id="IconIds.Search"
				width="20px"
				height="20px"
				:class="classes.icon"
			/>
			<input
				type="text"
				placeholder="Press S and start searching AAPL, BTC/USD, Gold, AUL…"
				:class="classes.input"
			/>
			<div :class="classes.line" />
		</div>
	</div>
</template>

<style module="classes">
.root {
	margin-bottom: 8px;
	color: var(--text-color-base-300);
}

.inputWrapper {
	position: relative;
	display: flex;
	align-items: center;
	gap: 8px;
}

.icon {
	position: absolute;
	top: 50%;
	left: 8px;
	transform: translateY(-50%);
	cursor: pointer;
}

.input {
	width: 100%;
	padding: 8px 8px 8px 36px;
	font-size: 14px;
	text-align: left;
	color: var(--text-color-base-300);
	background: transparent;
	border: none;
	outline: none;
}

.input::placeholder {
	text-align: left;
	color: var(--text-color-base-300);
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
	background: linear-gradient(to right, #ffffff 0%, #ffffff 50%, transparent 100%);
	mask-image: linear-gradient(to bottom, rgb(0 0 0 / 100%) 0%, transparent 100%);
}
</style>
