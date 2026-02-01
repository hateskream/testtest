<script setup lang="ts">
// Figma component: control-icon-24
import { type IconIds, UiIcon } from '@/shared/ui/icon';

export interface IControlIconProps {
	/**
	 * Название иконки
	 */
	icon: IconIds;
	/**
	 * Прозрачный фон без подложки
	 * @default false
	 */
	transparent?: boolean;
	/**
	 * Размер иконки в пикселях. Использовать с нестандартными иконками.
	 * @default 16
	 */
	iconSize?: number;
}

const props = withDefaults(defineProps<IControlIconProps>(), {
	iconSize: 16,
});
</script>

<template>
	<div :class="[classes.control, {[classes.transparent]: props.transparent}]">
		<ui-icon
			:id="props.icon"
			:width="props.iconSize"
			:height="props.iconSize"
		/>
	</div>
</template>

<style module="classes">
@layer kit {
	.control {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 24px;
		height: var(--height-s12, 24px);
		gap: var(--padding-s0, 0);
		aspect-ratio: 1/1;
		color: var(--icon-300, rgb(255 255 255 / 50%));
		transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
	}

	.control:not(:disabled) {
		cursor: pointer;
	}

	.control:not(.transparent) {
		background-color: var(--bg-100, rgb(73 73 80 / 32%));
		border-radius: var(--radius-s12-24, 9.2px);
		backdrop-filter: blur(9px);
	}

	.control:disabled {
		color: var(--icon-100, rgb(255 255 255 / 18%));

		&:not(.transparent) {
			background-color: var(--atom-base-80, rgb(73 73 80 / 22%));
		}
	}

	.control:not(:disabled):hover {
		color: var(--icon-500, rgb(255 255 255));

		&:not(.transparent) {
			background-color: var(--base-50, rgb(73 73 80 / 52%));
		}
	}

	.control:not(:disabled):active {
		color: var(--icon-500, rgb(255 255 255));

		&:not(.transparent) {
			background-color: var(--bg-500, rgb(73 73 80 / 90%));
		}
	}

	.control.transparent:not(:disabled):active:hover {
		color: var(--icon-300, rgb(255 255 255 / 50%));
	}
}
</style>
