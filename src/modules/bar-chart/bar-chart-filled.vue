<script setup lang="ts">
import { computed } from 'vue';

import type { IBarChartModel } from './bar-chart.model';

const props = withDefaults(defineProps<IBarChartModel>(), {
	minValue: 0,
	maxValue: 30,
	startValue: 0,
	currentValue: 0,
	barColor: '#D7D7D7',
	compact: true,
});


const activeIndex = computed(() => Math.round(props.currentValue) + props.startValue);
const isNegative = computed(() => activeIndex.value < props.startValue);
const isPositive = computed(() => activeIndex.value > props.startValue);

const chartZones = computed(() => {
	const center = props.startValue;
	const active = activeIndex.value;

	if (active < center) {
		return {
			leftBar: active === 0 ? 0 : active - 1,
			filledStart: active,
			filledSpan: center - active,
			rightBar: props.maxValue - center + 1,
		};
	} else if (active > center) {
		return {
			leftBar: center - 1,
			filledStart: center,
			filledSpan: active - center,
			rightBar: props.maxValue - active + 1,
		};
	} else {
		return {
			leftBar: center - 1,
			filledStart: center,
			filledSpan: 1,
			rightBar: props.maxValue - center + 1,
		};
	}
});

const filledColor = computed(() => {
	if (isNegative.value) {
		return 'var(--text-color-negative-500)';
	} else if (isPositive.value) {
		return 'var(--text-color-positive-500)';
	}
	// fallback
	return props.barColor || '#FFF';
});
</script>

<template>
	<div :class="classes.barChart">
		<div :class="classes.barChartWrapper">
			<div
				v-for="index in chartZones.leftBar"
				:key="index"
				:class="[classes.bar, { [classes.outlineActive]: isNegative }]"
			/>

			<div
				v-if="chartZones.filledSpan > 0"
				:class="classes.filledZone"
				:style="{
					gridColumn: `span ${chartZones.filledSpan}`
				}"
			/>

			<div
				v-for="index in chartZones.rightBar"
				:key="index"
				:class="[classes.bar, { [classes.outlineActive]: isPositive }]"
			/>
		</div>
	</div>
</template>

<style module="classes">
.barChart {
	display: flex;
	flex-grow: 1;
	align-self: stretch;
}

.barChartWrapper {
	display: grid;
	grid-template-columns: repeat(v-bind(maxValue), 1fr);
	gap: 1px;
	flex-grow: 1;
	align-items: center;
	align-self: stretch;
	padding: 1px 0;
}

.bar {
	width: 1px;
	height: 13px;
	background: v-bind(barColor);
	filter: brightness(30%);
	justify-self: center;
}

.filledZone {
	height: 100%;
	background: v-bind(filledColor);
	filter: brightness(90%);
}

.outlineActive {
	background: v-bind(filledColor);
	filter: brightness(60%), contrast(10%);
}
</style>
