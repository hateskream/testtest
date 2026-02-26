<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTooltipHint } from '@/shared/ui/tooltip-hint';

const props = defineProps<{
	maxWidth?: CSSProperties['maxWidth'];
}>();
</script>

<template>
	<ui-tooltip-hint
		placement="top"
		:open-delay="10"
		:class="classes.tooltip"
	>
		<template #trigger>
			<ui-icon
				:id="IconIds.InfoRectangle"
				:class="classes.icon"
				width="12px"
				height="12px"
			/>
		</template>
		<template #text>
			<div :style="{ maxWidth: props.maxWidth }">
				<slot />
			</div>
		</template>
	</ui-tooltip-hint>
</template>

<style module="classes">
.tooltip {
	cursor: pointer;
}

.icon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 12px;
	height: 12px;
	line-height: 1;
	color: var(--icon-300, rgb(255 255 255 / 50%));
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	user-select: none;
}

.tooltip:hover .icon {
	color: #ffffff;
}
</style>
