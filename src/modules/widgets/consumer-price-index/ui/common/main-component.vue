<script setup lang="ts">
import ChartComponent from './chart-component.vue';
import ChartLegend from './chart-legend.vue';
import MetricTrendBadge from './metric-trend-badge.vue';

interface IMetricTrendBadge {
	label: string;
	value: number;
	unit: string;
	trend: 'up' | 'down';
	isPercent: boolean;
}

interface IMainComponentProps {
	metricBadge: IMetricTrendBadge;
	legend: {
		label: string;
		color: string;
	}[];
}

const props = defineProps<IMainComponentProps>();

</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-badge
				:label="props.metricBadge.label"
				:value="props.metricBadge.value"
				:unit="props.metricBadge.unit"
				:trend="props.metricBadge.trend"
				:is-percent="props.metricBadge.isPercent"
			/>
			<chart-legend
				:items="props.legend"
			/>
		</div>
		<div :class="classes.chart">
			<chart-component />
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
}
</style>
