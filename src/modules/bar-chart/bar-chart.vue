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
	// TODO: Add index rendering mode
});


const activeIndex = computed(() => Math.round(props.currentValue));
</script>

<template>
	<div :class="classes.sparklineBarChart">
		<div :class="classes.sparklineBarChartWrapper">
			<div
				v-for="index in props.maxValue"
				:key="index"
				:class="classes.chartBar"
			>
				<div
					:class="[
						classes.bar,
						{[classes.current]: index === activeIndex},
						{[classes.active]: index <= activeIndex}
					]"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.sparklineBarChart {
	display: flex;
	flex-grow: 1;
}

.sparklineBarChartWrapper {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	padding: 1px 0;
}

.bar {
	width: 1px;
	height: 13px;
	background: v-bind(barColor);
	filter: brightness(30%);

	&.active {
		filter: brightness(100%);
	}

	&.current {
		width: 2px;
		height: 17px;
		border-radius: 10px;
		filter: brightness(100%);
	}
}
</style>
