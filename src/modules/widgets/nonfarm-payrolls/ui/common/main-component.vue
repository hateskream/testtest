<script setup lang="ts">
import ChartComponent from './chart-component.vue';
import MetricTrendBadge from './metric-trend-badge.vue';

interface IMetricTrendBadge {
	topValue: number;
	isTopValuePercent: boolean;
	label: string;
	value: number;
	unit: string;
	trend: 'up' | 'down';
	isGood: boolean;
	isPercent: boolean;
}

interface IPoints {
	time: string;
	value: number;
}

interface IMainComponentProps {
	metricBadge: IMetricTrendBadge;
	chartColorSchema: 'positive' | 'negative';
	points: IPoints[];
}

const props = defineProps<IMainComponentProps>();

</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-badge
				:top-value="props.metricBadge.topValue"
				:is-top-value-percent="props.metricBadge.isTopValuePercent"
				:is-good="props.metricBadge.isGood"
				:label="props.metricBadge.label"
				:value="props.metricBadge.value"
				:unit="props.metricBadge.unit"
				:trend="props.metricBadge.trend"
				:is-percent="props.metricBadge.isPercent"
			/>
		</div>
		<div :class="classes.chart">
			<chart-component
				:chart-color-schema="props.chartColorSchema"
				:points="props.points"
			/>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding-bottom: 20px;
}

.header {
	display: flex;
	justify-content: space-between;
	padding: 12px 20px;
}

.chart {
	flex-grow: 1;
	padding-left: 6px;
}
</style>
