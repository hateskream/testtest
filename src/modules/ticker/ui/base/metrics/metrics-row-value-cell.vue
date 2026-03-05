<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';

import { UiText } from '@/shared/ui/text';
import { UiIconInfoTooltip } from '@/shared/ui/icon-info-tooltip';

interface IMetricsRowValueCellProps {
	value?: string | null;
	unit?: string | null;
}

const props = defineProps<IMetricsRowValueCellProps>();

const hasValue = computed(() => notNullish(props.value));

const preparedValue = computed(() => {
	if (notNullish(props.value)) {
		if (props.unit) {
			return `${props.value} ${props.unit}`;
		}

		return props.value;
	}

	return undefined;
});
</script>

<template>
	<div :class="classes.cell">
		<ui-text
			:class="[classes.text, { [classes.empty]: !hasValue }]"
			align="right"
			token="text-200-r"
		>
			{{ preparedValue ?? '--' }}
		</ui-text>
		<ui-icon-info-tooltip v-if="hasValue && $slots.tooltip" max-width="320px">
			<slot name="tooltip" />
		</ui-icon-info-tooltip>
	</div>
</template>

<style module="classes">
.cell {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 84px;
	height: 30px;
	gap: var(--padding-s2, 2px);
}

.text {
	flex: 1 0 0;
	line-height: 1;
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.empty {
	padding-right: 17px;
	color: var(--color-text-base-100, #646568);
}
</style>
