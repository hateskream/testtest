<script setup lang="ts">
// Figma component: tooltip-hint
import type { Placement } from '@floating-ui/vue';

import { UiPositionTooltip } from '@/shared/ui/position';
import { UiText } from '@/shared/ui/text';

export interface ITooltipHintProps {
	/**
	 * Расположение тултипа относительно триггера
	 * @default bottom
	 */
	placement?: Placement;

	/**
	 * Ожидание в мс перед тем, как показать тултип
	 * @default 50
	 */
	openDelay?: number;

	/**
	 * Текст тултипа
	 */
	text?: string;
}

const props = withDefaults(defineProps<ITooltipHintProps>(), {
	placement: 'bottom',
	openDelay: 50,
	text: undefined,
});
</script>

<template>
	<ui-position-tooltip
		:placement="props.placement"
		:open-delay="props.openDelay"
	>
		<template #default>
			<slot name="trigger" />
		</template>
		<template #content>
			<div :class="classes.tooltipContent">
				<slot>
					<ui-text
						as="div"
						token="text-200-r"
						:class="classes.text"
					>
						<slot name="text">{{ props.text }}</slot>
					</ui-text>
				</slot>
			</div>
		</template>
	</ui-position-tooltip>
</template>

<style module="classes">
@layer kit {
	.tooltipContent {
		padding: var(--padding-s6, 10px) var(--padding-s8, 14px);
		background-color: var(--surface-modal, rgb(30 30 32 / 88%));
		border: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
		border-radius: var(--radius-s14-32, 12.4px);
		backdrop-filter: blur(9px);
	}

	.text {
		color: var(--text-500, rgb(255 255 255 / 96%));
	}
}
</style>
