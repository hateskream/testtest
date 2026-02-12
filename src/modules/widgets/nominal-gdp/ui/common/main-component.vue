<script setup lang="ts">
import { computed } from 'vue';

import type { INominalGdpHistory } from '@/modules/widgets/nominal-gdp/model';
import { UiLegendOption, UiLegendRow } from '@/shared/ui/legend';

import ChartComponent from './chart-component.vue';
import MetricTrendTag from './metric-trend-tag.vue';

interface IMainComponentProps {
	data: INominalGdpHistory;
	growthYoy: number;
}

const props = defineProps<IMainComponentProps>();

const metricTagValue = computed(() => Math.abs(props.growthYoy));
const metricTagTrend = computed(() => props.growthYoy > 0 ? 'up' : 'down');
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
				<ui-legend-option color="#fff" label="GDP" />
				<ui-legend-option color="#FF7F35" label="Potential GDP" />
			</ui-legend-row>
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
