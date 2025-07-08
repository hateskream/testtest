<script setup lang="ts">
import { computed } from 'vue';

import { PERFORMANCE_COLORS } from '@/modules/widgets/performance/const';

interface IPerformanceBarCellProps {
	value: number; // Percentage change value
	maxAbsValue?: number; // Maximum absolute value for scaling (optional)
}

const props = withDefaults(defineProps<IPerformanceBarCellProps>(), {
	maxAbsValue: 100, // Default max value for scaling
});

// Calculate bar width as percentage of maximum absolute value
const barWidth = computed(() => {
	const absValue = Math.abs(props.value);
	const maxAbs = props.maxAbsValue;
	return Math.min((absValue / maxAbs) * 100, 100);
});

// Get color based on positive/negative value
const barColor = computed(() => {
	return props.value >= 0 ? PERFORMANCE_COLORS.POSITIVE : PERFORMANCE_COLORS.NEGATIVE;
});

// Format the percentage value with sign
const formattedValue = computed(() => {
	const sign = props.value >= 0 ? '+' : '';
	return `${sign}${props.value.toFixed(2)}%`;
});
</script>

<template>
	<div :class="classes.performanceBarCell">
		<div :class="classes.barContainer">
			<div
				:class="classes.bar"
				:style="{
					width: `${barWidth}%`,
					backgroundColor: barColor
				}"
			/>
		</div>
		<span
			:class="classes.valueText"
			:style="{ color: barColor }"
		>
			{{ formattedValue }}
		</span>
	</div>
</template>

<style module="classes">
.performanceBarCell {
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
	min-height: 24px;
}

.barContainer {
	position: relative;
	flex: 1;
	min-width: 80px;
	height: 8px;
	border-radius: 2px;
}

.bar {
	min-width: 8px; /* Minimum width for very small values */
	height: 100%;
	border-radius: 4px;
}
</style>
