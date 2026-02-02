<script setup lang="ts">
// Figma component: tooltip-base
import type { Placement } from '@floating-ui/vue';

import { type IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPositionTooltip } from '@/shared/ui/position';
import { UiText } from '@/shared/ui/text';

export interface ITooltipBaseProps {
	/**
	 * Название иконки
	 */
	icon?: IconIds | null;
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
	 * Заголовок тултипа
	 */
	label: string;
	/**
	 * Текст тултипа
	 */
	text: string;
}

const props = withDefaults(defineProps<ITooltipBaseProps>(), {
	placement: 'bottom',
	openDelay: 50,
	icon: null,
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
				<div :class="classes.header">
					<div v-if="props.icon" :class="classes.iconWrapper">
						<ui-icon
							:id="props.icon"
							width="16px"
							height="16px"
							:class="classes.icon"
						/>
					</div>
					<ui-text as="div" token="text-200-r">
						<slot name="label">{{ props.label }}</slot>
					</ui-text>
				</div>
				<ui-text
					as="div"
					token="text-200-r"
					:class="classes.text"
				>
					<slot name="text">{{ props.text }}</slot>
				</ui-text>
			</div>
		</template>
	</ui-position-tooltip>
</template>

<style module="classes">
@layer kit {
	.tooltipContent {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 240px;
		padding: var(--padding-s6, 10px) var(--padding-s8, 14px);
		background-color: var(--surface-modal, rgb(30 30 32 / 88%));
		border: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
		border-radius: var(--radius-s14-32, 12.4px);
		gap: var(--padding-s1, 1px);
		backdrop-filter: blur(9px);
	}

	.header {
		display: flex;
		align-items: flex-start;
		gap: var(--padding-s3, 4px);
		align-self: stretch;
	}

	.iconWrapper {
		display: flex;
		align-items: center;
		padding: var(--padding-s3, 4px) 0;
	}

	.icon {
		color: var(--icon-300, rgb(255 255 255 / 50%));
	}

	.label {
		color: var(--text-500, rgb(255 255 255 / 96%));
	}

	.text {
		color: var(--text-300, rgb(255 255 255 / 62%));
	}
}
</style>
