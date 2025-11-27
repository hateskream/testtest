<script setup lang="ts">
import { computed } from 'vue';
import type { ChartOptions, TooltipOptions } from 'chart.js';

import { type BarDataset, ChartBar, ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import {
	barDashedBorderConfigurablePlugin,
	type IBarDashedBorderPluginConfig,
} from '@/modules/lightweight-charts/plugins';
import type { INominalGdpHistoryPoint } from '../../model';

interface IChartComponentProps {
	points: INominalGdpHistoryPoint[];
}

const props = defineProps<IChartComponentProps>();

const preparedLabels = computed(() => props.points.map(point => point.label));

const preparedDatasets = computed((): (BarDataset & Partial<IBarDashedBorderPluginConfig>)[] => {
	return [
		{
			data: props.points.map(point => point.forecast),
			backgroundColor: (context) => {
				if (!context.chart.chartArea) {
					return;
				}

				const { chart: currentChart } = context;

				return createGradient(
					currentChart.ctx,
					currentChart.chartArea.top,
					currentChart.chartArea.bottom,
				);
			},
			borderColor: '#FF8D29',
			borderRadius: 5,
			maxBarThickness: 15,
			barPercentage: 1,
			categoryPercentage: 0.7,
			dashedBorder: {
				dash: [2, 2],
				dashOffset: 0,
				width: 1,
				color: '#FF8D29',
				radius: 5,
			},
		},
		{
			data: props.points.map(point => point.history).filter(point => point !== 0),
			backgroundColor: 'rgba(255, 255, 255, 0.90)',
			borderColor: 'rgba(255, 255, 255, 0.90)',
			borderRadius: 5,
			maxBarThickness: 15,
			barPercentage: 1,
			categoryPercentage: 0.7,
		},
	];
});

function createGradient(context2D: CanvasRenderingContext2D, from: number, to: number) {
	const gradient = context2D.createLinearGradient(0, from, 0, to);

	gradient.addColorStop(0, 'rgba(255, 127, 53, 0.20)');
	gradient.addColorStop(1, 'rgba(153, 76, 32, 0.14)');

	return gradient;
}

// tooltip

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '',
});

const options = {
	interaction: {
		mode: 'index',
		intersect: false,
	},
	hover: { mode: 'dataset' },
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			enabled: false,
			external: handler as unknown as TooltipOptions<'bar'>['external'],
		},
	},
} as const satisfies ChartOptions<'bar'>;

const plugins = [barDashedBorderConfigurablePlugin];
</script>

<template>
	<chart-bar
		:datasets="preparedDatasets"
		:labels="preparedLabels"
		:options="options"
		:plugins="plugins"
	/>
	<teleport to="body">
		<chart-external-tooltip v-bind="state" />
	</teleport>
</template>
