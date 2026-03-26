<script setup lang="ts">
import { computed } from 'vue';

import { formatPercent } from '../../lib';

interface IChartDateRangeChangeProps {
	value: number;
	isPercent?: boolean;
	trend: 'positive' | 'negative';
}

const props = defineProps<IChartDateRangeChangeProps>();

const label = computed(() => {
	const formatted = formatPercent(Math.abs(props.value));

	const prepared = props.value < 0
		? `−\u00A0${formatted}`
		: formatted;

	if (props.isPercent) {
		return `${prepared}%`;
	}

	return prepared;
});
</script>

<template>
	<span :class="classes[props.trend]">
		{{ label }}
	</span>
</template>


<style module="classes">
.negative {
	color: var(--atom-warning-00, #fc1d4d);
}

.positive {
	color: var(--atom-success-00, #04eda0);
}
</style>
