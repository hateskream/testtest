<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { type IWatchlistPercentCell } from '@/modules/widgets/watchlist/model';
import { getPercentTrendClass } from '@/modules/widgets/watchlist/const';


interface IProps {
	data: IWatchlistPercentCell;
}

const props = defineProps<IProps>();

const classes = useCssModule('classes');

const displayValue = computed(() => {
	if (!props.data.value || props.data.value === 'N/A' || isNaN(+props.data.value)) {
		return '—';
	}
	return `${props.data.value}%`;
});

const percentClasses = computed<string>(() => {
	if (!props.data.value) {
		return classes.commonly;
	}

	const trendClass = getPercentTrendClass(props.data.value, props.data.trend);
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
