<script setup lang="ts">
import { UiTooltip } from '@/shared/ui/tooltip';
</script>

<template>
	<ui-tooltip
		:show-in-ms="10"
		position="top"
		:class="classes.tooltipWrapper"
	>
		<template #default>
			<div :class="classes.iconWrapper">i</div>
		</template>
		<template #content>
			<slot>This is so important content for this help</slot>
		</template>
	</ui-tooltip>
</template>

<style module="classes">
.tooltipWrapper {
	cursor: pointer;
	&:hover{
		.iconWrapper{
			color: var(--text-color-base-500);
		}
	}
}
.iconWrapper {
	width: 12px;
	height: 12px;
	background-color: var(--bg-color-base-300);
	color: var(--text-color-base-300);
	cursor: pointer;
	transition: all .2s ease-in-out;
	border-radius: 99999px;
	font-size: 8px;
	line-height: 1;
	display:flex;
	align-items:center;
	justify-content: center;
	user-select: none;
}

</style>
