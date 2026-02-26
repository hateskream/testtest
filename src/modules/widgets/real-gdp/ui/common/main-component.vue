<script setup lang="ts">
import { computed } from 'vue';

import { UiLegendOption, UiLegendRow } from '@/shared/ui/legend';
import { calculateGrowthYoy, type RealGdpHistory } from '../../model';

import ChartComponent from './chart-component.vue';
import MetricTrendTag from './metric-trend-tag.vue';

interface IMainComponentProps {
	data: RealGdpHistory;
}

const props = defineProps<IMainComponentProps>();

const growthYoy = computed(() => calculateGrowthYoy(props.data.points));

const metricTagValue = computed(() => Math.abs(growthYoy.value));
const metricTagTrend = computed(() => growthYoy.value > 0 ? 'up' : 'down');
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-tag
				:value="metricTagValue"
				:trend="metricTagTrend"
				is-percent
			/>
			<ui-legend-row>
				<ui-legend-option color="#fff" label="Real GDP" />
			</ui-legend-row>
		</div>
		<div :class="classes.chart">
			<chart-component :points="props.data.points" value-type="points" />
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
