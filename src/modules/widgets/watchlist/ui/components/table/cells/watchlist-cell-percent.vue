<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import type { IWatchlistPercentCell } from '../../../../model';
import { getPercentTrendClass } from '../../../../const';

interface IProps {
	cell: IWatchlistPercentCell;
}

const props = defineProps<IProps>();

const classes = useCssModule('classes');

const displayValue = computed(() => {
	if (!props.cell.value || props.cell.value === 'N/A' || isNaN(+props.cell.value)) {
		return '—';
	}
	return `${props.cell.value}%`;
});

const percentClasses = computed<string>(() => {
	if (!props.cell.value) {
		return classes.commonly;
	}

	const trendClass = getPercentTrendClass(props.cell.value, props.cell.trend);
	return classes[trendClass] || classes.commonly;
});
</script>

<template>
	<div :class="[percentClasses, classes.percent]">{{ displayValue }}</div>
</template>

<style module="classes">
.commonly {
	color: var(--text-color-base-300);
}

.positive {
	color: var(--metrics-color-positive);
}

.negative {
	color: var(--metrics-color-negative-500);
}

.percent {
	width: 100%;
}
</style>
