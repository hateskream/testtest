<script setup lang="ts">
import { computed } from 'vue';
import { LastPriceAnimationMode } from '@shared/component-library';

import { Chart } from '@/modules/lightweight-charts';
import { type DateRangePresetValue, type DateRangeValue, strTimeToChartTime } from '@/modules/lightweight-charts/model';
import type { ChartPriceCurrentData, ChartPriceHistoryPoint } from '../../model';

export interface IChartPriceTickerProps {
	points: ChartPriceHistoryPoint[];
	current: ChartPriceCurrentData;
	handleScale?: boolean;
	dateRangePresets?: DateRangePresetValue[];
}

const props = withDefaults(defineProps<IChartPriceTickerProps>(), {
	dateRangePresets: () => [],
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
</script>

<template>
	<div :class="classes.container">
		<chart
			v-model:date-range="dateRange"
			:date-range-presets="props.dateRangePresets"
			width="100%"
			height="100%"
			is-show-tooltip
			:handle-scale="handleScale"
			type="candlestick"
			can-switch-type
			:data="preparedChartData"
			:last-price-animation="LastPriceAnimationMode.Continuous"
			:color-schema="chartColorSchema"
			:prev-close-price="props.current.prevClosePrice"
			:right-offset-pixels="120"
			price-label="Current"
			fade-left
			show-instruments
		/>
	</div>
</template>

<style module="classes">
.container {
	width: 100%;
}
</style>
