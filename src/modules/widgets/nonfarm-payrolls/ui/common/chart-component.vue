<script setup lang="ts">
import { CrosshairMode } from 'lightweight-charts';
import { computed } from 'vue';
import type { ChartData } from '@shared/component-library';

import { RangeChart } from '@/shared/ui/chart-range';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';

interface IPoints {
	label: string;
	history: number;
}
interface IMarketCapChartProps {
	chartColorSchema: 'positive' | 'negative';
	points: IPoints[];
}

const props = defineProps<IMarketCapChartProps>();

const chartData = computed<ChartData[]>(() => {
	return props.points.map(point => {
		return {
			time: point.label,
			value: point.history,
		} as ChartData;
	});
});
</script>

<template>
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
