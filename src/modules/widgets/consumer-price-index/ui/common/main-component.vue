<script setup lang="ts">
import { computed } from 'vue';

import { CpiValueType, type ICpiHistory } from '../../model';

import ChartComponent from './chart-component.vue';
import ChartLegend from './chart-legend.vue';
import type { IMetricTrendTag } from './metric-trend-tag.vue';
import MetricTrendTag from './metric-trend-tag.vue';

interface IMainComponentProps {
	data: ICpiHistory;
	valueType: CpiValueType;
}

const props = defineProps<IMainComponentProps>();

const metricTag = computed((): IMetricTrendTag => {
	return {
		value: Math.abs(props.data.growth_yoy),
		// TODO: Points/Change/ChangePercent filter
		unit: 'points',
		trend: props.data.growth_yoy > 0 ? 'up' : 'down',
		isPercent: false,
	};
});

const legends = [
	{
		label: 'CPI',
		color: '#fff',
	},
];
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-tag
				:value="metricTag.value"
				:unit="metricTag.unit"
				:trend="metricTag.trend"
				:is-percent="metricTag.isPercent"
			/>
			<chart-legend :items="legends" />
		</div>
		<div :class="classes.chart">
			<chart-component :points="props.data.points" :value-type="props.valueType" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: space-between;
	padding: 32px 20px 12px;
}

.chart {
	flex-grow: 1;
	padding: 0 20px;
}
</style>
