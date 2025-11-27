<script setup lang="ts">
import { computed } from 'vue';

import type { INominalGdpHistory } from '@/modules/widgets/nominal-gdp/model';

import ChartComponent from './chart-component.vue';
import ChartLegend from './chart-legend.vue';
import type { IMetricTrendTag } from './metric-trend-tag.vue';
import MetricTrendTag from './metric-trend-tag.vue';

interface IMainComponentProps {
	data: INominalGdpHistory;
}

const props = defineProps<IMainComponentProps>();

const metricTag = computed((): IMetricTrendTag => {
	// TODO: Убрать ручное вычисление, когда бекенд добавит в апи
	const firstNominalPointIndex = props.data.points.findIndex(point => point.history === 0);

	const lastRealNominalPointIndex = firstNominalPointIndex === -1
		? props.data.points.length - 1
		: firstNominalPointIndex - 1;

	const [firstPoint, lastPoint] =
		[props.data.points[lastRealNominalPointIndex - 1], props.data.points[lastRealNominalPointIndex]];

	const value = (lastPoint.history - firstPoint.history) / lastPoint.history * 100;

	return {
		value: Math.abs(value),
		trend: value > 0 ? 'up' : 'down',
		isPercent: true,
	};
});

const legends = [
	{
		label: 'GDP',
		color: '#fff',
	},
	{
		label: 'Potential GDP',
		color: '#FF7F35',
	},
];
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-tag
				:value="metricTag.value"
				:trend="metricTag.trend"
				:is-percent="metricTag.isPercent"
			/>
			<chart-legend :items="legends" />
		</div>
		<div :class="classes.chart">
			<chart-component :points="props.data.points" />
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
