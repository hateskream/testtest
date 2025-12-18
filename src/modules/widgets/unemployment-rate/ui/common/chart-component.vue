<script setup lang="ts">
import { CrosshairMode } from 'lightweight-charts';

import { RangeChart } from '@/shared/ui/chart-range';
import { Chart } from '@/modules/lightweight-charts';

interface IMarketCapChartProps {
	chartColorSchema: 'positive' | 'negative';
	points: { time: string; value: number }[];
}

const props = defineProps<IMarketCapChartProps>();

const rangeList = Object.values(RangeChart);
</script>

<template>
	<chart
		:range-list="rangeList"
		:is-visible-history-graph="false"
		:is-visible-indicators="false"
		:is-visible-range="false"
		:is-visible-range-change="false"
		:is-visible-price-scale="false"
		:is-visible-time-scale="false"
		:is-padded-range="false"
		:is-show-tooltip="false"
		:crosshair-mode="CrosshairMode.Hidden"
		:is-visible-price-line="false"
		:width="100"
		height="100%"
		disable-scroll
		:color-schema="props.chartColorSchema"
		:data="props.points"
		fade-left
	/>
</template>
