<script setup lang="ts">
import { computed, onUnmounted, useTemplateRef, watch } from 'vue';
import { type ChartType, LastPriceAnimationMode } from '@shared/component-library';

import { Chart } from '@/modules/lightweight-charts';
import {
	type DateRangePresetValue,
	type DateRangeValue,
	strTimeToChartTime,
	TimezoneUtc,
	type TimezoneUtcType,
} from '@/modules/lightweight-charts/model';
import type { ChartPriceCurrentData, ChartPriceHistoryPoint } from '../../model';
import { useChartContext } from '@/modules/lightweight-charts/composables';
import { getIndicatorSeriesConfig, type IndicatorType, mapIndicatorToBaselineSeries } from '@/modules/indicator';
import { createSma } from '@/modules/indicator/sma';

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

const currentIndicators = {} as Record<IndicatorType, () => void>;

function addIndicator(indicator: IndicatorType) {
	const current = currentIndicators[indicator];
	if (current) {
		return current;
	}

	const chartEl = chartRef.value;
	if (!chartEl) {
		return null;
	}

	const value = registerIndicator(indicator);
	if (value) {
		currentIndicators[indicator] = value;
		return value;
	}

	return null;
}

function registerIndicator(indicator: IndicatorType) {
	if (!context || !chartRef.value) {
		return;
	}

	const indicatorInstance = createSma({ period: 14 });
	indicatorInstance.calculate(context.getAll());

	const config = getIndicatorSeriesConfig(indicator);
	const series = chartRef.value.addSeries(config.definition, config.options, config.paneIndex);
	if (series) {
		const data = mapIndicatorToBaselineSeries(indicatorInstance.getResult());
		series.setData(data);
	}

	const cleanupBulk = context.subscribeBulk((candles) => {
		indicatorInstance.calculate(candles);
	});

	const cleanup = context.subscribe((candle) => {
		indicatorInstance.update(candle);
	});

	return () => {
		cleanup();
		cleanupBulk();
	};
}

function deleteIndicator(indicator: IndicatorType) {
	const unsubscriber = currentIndicators[indicator];
	if (unsubscriber) {
		unsubscriber();
	}
}

watch(() => props.indicators, (newIndicators, oldIndicators) => {
	const deletedIndicators = oldIndicators.filter(indicator => !newIndicators.includes(indicator));
	const addedIndicators = newIndicators.filter(indicator => !oldIndicators.includes(indicator));

	for (const indicator of deletedIndicators) {
		deleteIndicator(indicator);
	}

	for (const indicator of addedIndicators) {
		addIndicator(indicator);
	}
}, { deep: true });

onUnmounted(() => {
	Object.values(currentIndicators).forEach(unsubscriber => unsubscriber());
});
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
