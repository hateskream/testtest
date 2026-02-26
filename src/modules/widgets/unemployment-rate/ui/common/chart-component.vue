<script setup lang="ts">
import { CrosshairMode } from 'lightweight-charts';

import { Chart } from '@/modules/lightweight-charts';

interface IMarketCapChartProps {
	chartColorSchema: 'positive' | 'negative';
	points: { time: string; value: number }[];
}

const props = defineProps<IMarketCapChartProps>();
</script>

<template>
	<chart
		:is-visible-price-scale="false"
		:is-visible-time-scale="false"
		:is-show-tooltip="false"
		:crosshair-mode="CrosshairMode.Hidden"
		:is-visible-price-line="false"
		height="100%"
		:color-schema="props.chartColorSchema"
		:data="props.points"
		fade-left
		auto-size
	/>
</template>
