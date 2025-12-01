<script setup lang="ts">
import { computed } from 'vue';
import { CrosshairMode, type CandlestickData, type Time } from 'lightweight-charts';

import { RangeChart } from '@/shared/ui/chart-range';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';

interface IMarketCapChartProps {
	chartColorSchema: 'positive' | 'negative';
	points: { label: string; history: number }[];
}

const props = defineProps<IMarketCapChartProps>();

const chartData = computed<CandlestickData[]>(() => {
	return props.points.map(point => {
		const time = Math.floor(new Date(point.label).getTime() / 1000) as Time;
		const value = point.history;

		return {
			time,
			open: value,
			high: value,
			low: value,
			close: value,
		};
	}).sort((a, b) => (a.time as number) - (b.time as number));
});
</script>

<template>
	{{chartData}}
	<chart-component
		:range-list="Object.values(RangeChart)"
		:is-visible-history-graph="false"
		:is-visible-indicators="false"
		:is-visible-range="false"
		:is-visible-range-change="false"
		:is-visible-price-scale="false"
		:is-visible-time-scale="false"
		:is-padded-range="false"
		:is-show-tooltip="false"
		:crosshair-mode="CrosshairMode.Hidden"
		:price-visible="false"
		:width="100"
		height="100%"
		disable-scroll
		:color-schema="props.chartColorSchema"
		:data="chartData"
	/>
</template>
