<script setup lang="ts">
import { computed, toRef, useTemplateRef, watch } from 'vue';
import { type ChartType, LastPriceAnimationMode } from '@shared/component-library';

import { Chart } from '@/modules/charts/lightweight';
import {
	type DateRangePresetValue,
	type DateRangeValue,
	strTimeToChartTime,
	TimezoneUtc,
	type TimezoneUtcType,
} from '@/modules/charts/common/model';
import type { ChartPriceCurrentData, ChartPriceHistoryPoint } from '../../model';
import { useChartContextIndicators } from '@/modules/charts/lightweight/composables';
import { useChartContext } from '@/modules/charts/common/composables';
import { type IndicatorType } from '@/modules/indicator';

export interface IChartPriceTickerProps {
	points: ChartPriceHistoryPoint[];
	current: ChartPriceCurrentData;
	handleScale?: boolean;
	handleScroll?: boolean;
	dateRangePresets?: DateRangePresetValue[];
	type?: ChartType;
	timezone?: TimezoneUtcType;
	indicators?: IndicatorType[];
}

const props = withDefaults(defineProps<IChartPriceTickerProps>(), {
	dateRangePresets: () => [],
	type: 'area',
	timezone: TimezoneUtc.UTC0,
	indicators: () => [],
});

const dateRange = defineModel<DateRangeValue>('dateRange', { required: true });

const chartColorSchema = computed(() => props.current.changePercent > 0 ? 'positive' : 'negative');

const preparedChartData = computed(() => {
	return props.points.map(point => ({
		time: strTimeToChartTime(point.timestamp),
		open: point.priceCandle.open,
		high: point.priceCandle.high,
		low: point.priceCandle.low,
		close: point.priceCandle.close,
	}));
});

const chartRef = useTemplateRef('chart');

function takeScreenshot() {
	if (chartRef.value) {
		return chartRef.value.takeScreenshot(true, true);
	}

	return null;
}

defineExpose({ takeScreenshot });

// context

const context = useChartContext();

watch(preparedChartData, value => {
	if (value) {
		context.init(value);
	}
}, { immediate: true, deep: true });

useChartContextIndicators(chartRef, toRef(props, 'indicators'));
</script>

<template>
	<div :class="classes.container">
		<chart
			ref="chart"
			v-model:date-range="dateRange"
			:date-range-presets="props.dateRangePresets"
			width="100%"
			height="100%"
			is-show-tooltip
			:handle-scale="handleScale"
			:handle-scroll="handleScroll"
			:type="props.type"
			can-switch-type
			:data="preparedChartData"
			:last-price-animation="LastPriceAnimationMode.Continuous"
			:color-schema="chartColorSchema"
			:prev-close-price="props.current.prevClosePrice"
			:right-offset-pixels="120"
			:timezone="props.timezone"
			price-label="Current"
			fade-left
			auto-size
		/>
	</div>
</template>

<style module="classes">
.container {
	width: 100%;
}
</style>
