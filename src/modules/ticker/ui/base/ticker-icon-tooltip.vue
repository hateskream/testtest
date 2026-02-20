<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { UiPositionTooltip } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTooltipWrapper } from '@/shared/ui/tooltip';

const props = defineProps<{
	maxWidth?: CSSProperties['maxWidth'];
}>();
</script>

<template>
	<ui-position-tooltip
		:open-delay="10"
		placement="top"
		:class="classes.tooltip"
	>
		<template #default>
			<ui-icon
				:id="IconIds.InfoRectangle"
				:class="classes.icon"
				width="12px"
				height="12px"
			/>
		</template>
		<template #content>
			<ui-tooltip-wrapper
				:class="classes.wrapper"
				:style="{ maxWidth: props.maxWidth }"
				display-variant="new"
			>
				<slot>This is so important content for this help</slot>
			</ui-tooltip-wrapper>
		</template>
	</ui-position-tooltip>
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

.wrapper {
	color: #ffffff;
}
</style>
