<script setup lang="ts">
import { computed } from 'vue';

import { IconIds } from '@/shared/ui/icon';
import { TagColor, UiTag } from '@/shared/ui/tag';

export interface IMetricTrendTag {
	value: number;
	unit?: string;
	trend: 'up' | 'down';
}

const props = defineProps<IMetricTrendTag>();

const isUpTrend = computed(() => props.trend === 'up');

const preparedValue = computed(() => {
	const fixed = props.value.toFixed(2);

	if (props.unit) {
		return `${fixed} ${props.unit}`;
	}

	return fixed;
});

const icon = computed(() => isUpTrend.value ? IconIds.Gainers : IconIds.Loosers);
const color = computed(() => isUpTrend.value ? TagColor.Positive : TagColor.Negative);
</script>

<template>
	<ui-tag
		:color="color"
		:icon="icon"
		:icon-size="8"
	>
		<template #default>
			<span>Growth YoY: </span>
			<span v-if="!isUpTrend">−&nbsp;</span>
			<span>{{ preparedValue }}</span>
		</template>
	</ui-tag>
</template>
