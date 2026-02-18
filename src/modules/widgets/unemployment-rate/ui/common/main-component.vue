<script setup lang="ts">
import { computed } from 'vue';

import type { IUnemploymentRateResponse } from '../../model';

import ChartComponent from './chart-component.vue';
import MetricTrendBadge from './metric-trend-badge.vue';

interface IMainComponentProps {
	data: IUnemploymentRateResponse;
}

const props = defineProps<IMainComponentProps>();

const chartColorSchema = computed(() => props.data.change.isPositive ? 'positive' : 'negative');

const points = computed(() => props.data.points.map(point => ({
	time: point.label,
	value: point.history,
})));
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-badge
				:primary-value="props.data.primaryValue"
				:primary-value-unit="props.data.primaryValueUnit"
				:change="props.data.change"
			/>
		</div>
		<div :class="classes.chart">
			<chart-component
				:chart-color-schema="chartColorSchema"
				:points="points"
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
