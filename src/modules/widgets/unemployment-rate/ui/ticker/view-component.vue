<script setup lang="ts">
import { computed } from 'vue';

import type { ITickerWidgetMeta } from '@/modules/ticker';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import type { IUnemploymentRateResponse } from '../../model';

import ChartComponent from '../common/chart-component.vue';
import MetricTrendBadge from '../common/metric-trend-badge.vue';

const props = defineProps<{
	currentData: IUnemploymentRateResponse;
	meta: ITickerWidgetMeta;
}>();

const chartColorSchema = computed(() => {
	if (!props.currentData) {
		return 'positive';
	}

	return props.currentData.change.isPositive ? 'positive' : 'negative';
});

const chartPoints = computed(() => {
	if (!props.currentData) {
		return [];
	}

	return props.currentData.points.map(point => ({
		time: point.label,
		value: point.history,
	}));
});
</script>

<template>
	<base-ticker-widget-wrapper v-if="props.currentData">
		<base-ticker-widget-header>{{ props.meta.name }}</base-ticker-widget-header>
		<base-ticker-widget-content :class="classes.content">
			<div :class="classes.meta">
				<metric-trend-badge
					:primary-value="props.currentData.primaryValue"
					:primary-value-unit="props.currentData.primaryValueUnit"
					:change="props.currentData.change"
				/>
			</div>

			<div :class="classes.chart">
				<chart-component
					:chart-color-schema="chartColorSchema"
					:points="chartPoints"
				/>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s11, 20px) 0;
	gap: var(--padding-padding-s7, 12px);
}

.meta {
	padding-left: var(--padding-padding-s11, 20px);
}

.chart {
	align-self: stretch;
	height: var(--height-height-s18, 52px);
}
</style>
