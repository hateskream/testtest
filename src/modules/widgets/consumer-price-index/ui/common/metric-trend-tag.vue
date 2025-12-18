<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTag } from '@/shared/ui/tag';

export interface IMetricTrendTag {
	value: number;
	unit?: string;
	trend: 'up' | 'down';
	isPercent: boolean;
}

const props = defineProps<IMetricTrendTag>();

const isUpTrend = computed(() => props.trend === 'up');

const preparedValue = computed(() => {
	const fixed = props.value.toFixed(2);

	if (props.isPercent) {
		return `${fixed}%`;
	}

	if (props.unit) {
		return `${fixed} ${props.unit}`;
	}

	return fixed;
});

const icon = computed(() => isUpTrend.value ? IconIds.Gainers : IconIds.Loosers);
</script>

<template>
	<ui-tag :class="classes[props.trend]">
		<template #default>
			<span>Growth YoY: </span>
			<span :class="classes.value">
				<span v-if="!isUpTrend">−&nbsp;</span>
				<span>{{ preparedValue }}</span>
			</span>
		</template>
		<template #icon>
			<ui-icon
				:id="icon"
				height="6px"
				width="6px"
				:class="classes.icon"
			/>
		</template>
	</ui-tag>
</template>

<style module="classes">
.up .value,
.up .icon {
	color: var(--atom-success-00, #04eda0);
}

.down .value,
.down .icon {
	color: var(--warning-warning-00, #fc1d4d);
}
</style>
