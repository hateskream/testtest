<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
</script>

<template>
	<button :class="classes.clearBadge">
		<span :class="classes.iconWrapper">
			<ui-icon
				:id="IconIds.CloseThicc"
				width="6px"
				height="6px"
			/>
		</span>

		Clear
	</button>
</template>

<style module="classes">
.clearBadge {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding:
		var(--padding-padding-s3, 4px) var(--tile-padding-md-in, 10px)
		var(--padding-padding-s3, 4px) var(--tile-padding-md-out, 6px);
	font-style: normal;
	font-weight: 450;
	font-size: 11.8px;
	line-height: 165%;
	color: rgb(255 255 255 / 96%);
	background: none;
	border-radius: var(--radius-radius-s12-24, 9.2px);
	cursor: pointer;
	transition-timing-function: ease-in-out;
	transition-duration: 0.2s;
	transition-property: color, background-color;
	gap: var(--padding-padding-s3, 4px);
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 16px;
	height: 16px;
	line-height: 0;
	background: #292d32;
	border-radius: 50%;
	opacity: 0.2;
	fill: rgb(217 217 217 / 100%);
}

.clearBadge:hover {
	color: var(--text-color-base-500);
	background: var(--base-base-80, rgb(73 73 80 / 22%));
}

.clearBadge:active {
	color: var(--text-color-base-500);
	background: var(--bg-500, rgb(73 73 80 / 70%));
}
</style>
