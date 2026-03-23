<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import type { ChartOptions, TooltipOptions } from 'chart.js';

import { type BarDataset, ChartBar, ChartExternalTooltip } from '@/modules/charts/chart-js';
import { useExternalTooltip } from '@/modules/charts/chart-js/composables';
import { useAdaptiveBarPoints } from '@/modules/charts/common/composables';
import { barDashedBorderPlugin, type IBarDashedBorderPluginConfig } from '@/modules/charts/chart-js/plugins';
import type { NominalGdpHistoryPoint } from '../../model';

const BAR_WIDTH = 15;
const BAR_SPACE = 5;

interface IChartComponentProps {
	points: NominalGdpHistoryPoint[];
}

const props = defineProps<IChartComponentProps>();

const { points: filteredPoints } = useAdaptiveBarPoints(
	() => props.points,
	useTemplateRef('wrapper'),
	{ barWidth: BAR_WIDTH * 2 + BAR_SPACE },
);

const preparedLabels = computed(() => filteredPoints.value.map(point => point.label));

const preparedDatasets = computed((): (BarDataset & Partial<IBarDashedBorderPluginConfig>)[] => {
	return [
		{
			data: filteredPoints.value.map(point => point.forecast ?? null),
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
			maxBarThickness: BAR_WIDTH,
			barPercentage: 1,
			categoryPercentage: 0.7,
			dashedBorder: {
				dash: [2, 2],
				dashOffset: 0,
				width: 1,
				color: '#FF8D29',
				radius: 5,
			},
			label: 'Potential',
		},
		{
			data: filteredPoints.value.map(point => point.history).filter(point => point !== 0),
			backgroundColor: 'rgba(255, 255, 255, 0.90)',
			borderColor: 'rgba(255, 255, 255, 0.90)',
			borderRadius: 5,
			maxBarThickness: BAR_WIDTH,
			barPercentage: 1,
			categoryPercentage: 0.7,
			label: 'History',
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

const plugins = [barDashedBorderPlugin];
</script>

<template>
	<div ref="wrapper" :class="classes.wrapper">
		<chart-bar
			:datasets="preparedDatasets"
			:labels="preparedLabels"
			:options="options"
			:plugins="plugins"
		/>
		<teleport to="body">
			<chart-external-tooltip v-bind="state" />
		</teleport>
	</div>
</template>

<style module="classes">
.wrapper {
	height: 100%;
}
</style>
