<script setup lang="ts">
import { computed } from 'vue';

import { useSegmentedControlContext } from './use-segmented-control-context';
import type { SegmentedControlModel } from './model';

export interface IUiSegmentedControlItemProps {
	/**
	 * Значение контрола, используемое в модели.
	 * Заменит контент, если он не будет передан через slot.
	 */
	value: SegmentedControlModel;
}

const props = defineProps<IUiSegmentedControlItemProps>();

const { select, active } = useSegmentedControlContext();

function onClick() {
	select(props.value);
}

const isActive = computed(() => active.value === props.value);
</script>

<template>
	<button
		class="text-200-r"
		:class="[classes.segment, {[classes.active]: isActive}]"
		@click="onClick"
	>
		<slot>{{ props.value }}</slot>
	</button>
</template>

<style module="classes">
@layer kit {
	.segment {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 28px;
		padding: 0 12px;
		color: var(--text-300, rgb(255 255 255 / 62%));
		background-color: var(--bg-100, rgb(73 73 80 / 32%));
		border-radius: var(--radius-s9-16, 6px);
		cursor: pointer;
		transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
		gap: 3px;
	}

	.segment:hover {
		color: var(--text-500, rgb(255 255 255 / 96%));
		background-color: var(--bg-300, rgb(73 73 80 / 52%));
	}

	.segment.active {
		color: var(--text-500, rgb(255 255 255 / 96%));
		background-color: var(--bg-500, rgb(73 73 80 / 90%));
	}

	.segment:first-child {
		border-radius:
			var(--control-ct-sm28-radius, 10.8px) var(--radius-s9-16, 6px)
			var(--radius-s9-16, 6px) var(--control-ct-sm28-radius, 10.8px);
	}

	.segment:last-child {
		border-radius:
			var(--radius-s9-16, 6px) var(--control-ct-sm28-radius, 10.8px)
			var(--control-ct-sm28-radius, 10.8px) var(--radius-s9-16, 6px);
	}
}
</style>
