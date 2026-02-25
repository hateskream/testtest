<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import type { RadialLinearScaleOptions } from 'chart.js';

import type { AnalystRatings } from '../../model';
import { AnalystRatingsSummary } from '../../model';
import { getCssVar } from '@/shared/lib';

interface IAnalystRatingsRadarChartProps {
	data: AnalystRatings;
}

const props = defineProps<IAnalystRatingsRadarChartProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();

function getSummaryColors(summary: string) {
	const map: Record<string, { border: string; background: string }> = {
		[AnalystRatingsSummary.Optimistic]: {
			border: getCssVar('--atom-success-00', '#04EDA0'),
			background: getCssVar('--atom-success-70', 'rgba(4, 237, 160, 0.30)'),
		},
		[AnalystRatingsSummary.Pessimistic]: {
			border: getCssVar('--atom-warning-00', '#FC1D4D'),
			background: getCssVar('--atom-warning-70', 'rgba(252, 29, 77, 0.30)'),
		},
		[AnalystRatingsSummary.Neutral]: {
			border: getCssVar('--atom-contrast-00', '#FFF'),
			background: getCssVar('--atom-contrast-70', 'rgba(255, 255, 255, 0.30)'),
		},
	};

	return map[summary] ?? map[AnalystRatingsSummary.Neutral];
}

const MAX_SCALE = 10;

function scaleValues(values: number[]): number[] {
	const max = Math.max(...values);
	if (max <= MAX_SCALE) {
		return values;
	}
	return values.map(v => (v / max) * MAX_SCALE);
}

const chartValues = computed(() => [
	props.data.neutral,
	props.data.buy,
	props.data.strongBuy,
	props.data.strongSell,
	props.data.sell,
]);

const chartColors = computed(() => getSummaryColors(props.data.summary));

function createLabels() {
	return [
		`Neutral: ${props.data.neutral}`,
		`Buy: ${props.data.buy}`,
		`Strong Buy: ${props.data.strongBuy}`,
		`Strong Sell: ${props.data.strongSell}`,
		`Sell: ${props.data.sell}`,
	];
}

function createDatasets() {
	const scaledValues = scaleValues(chartValues.value);
	const colors = chartColors.value;

	return [{
		data: scaledValues,
		backgroundColor: colors.background,
		borderColor: colors.border,
		borderWidth: 1,
		pointBackgroundColor: colors.border,
		pointBorderColor: '#fff',
		pointBorderWidth: 0,
		pointHitRadius: 12,
	}];
}

function updateChartData() {
	const chartValue = chart.value;
	if (!chartValue) {
		return;
	}

	chartValue.data.labels = createLabels();
	chartValue.data.datasets = createDatasets();

	const scale = chartValue.options.scales!.r as RadialLinearScaleOptions;
	if (scale) {
		scale.angleLines.color = chartColors.value.border;
	}

	chartValue.update();
}

watch([chartValues, chartColors], updateChartData, { deep: true });

onMounted(() => {
	if (!container.value) {
		return;
	}

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'radar',
		data: {
			labels: createLabels(),
			datasets: createDatasets(),
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					callbacks: {
						label: (context) => {
							return ` ${chartValues.value[context.dataIndex]}`;
						},
					},
				},
			},
			scales: {
				r: {
					backgroundColor: getCssVar('--Surface-00', 'rgba(0, 0, 0, 1)'),
					beginAtZero: false,
					min: -2,
					max: MAX_SCALE,
					ticks: {
						display: false,
					},
					grid: {
						color: '#383838',
					},
					angleLines: {
						color: chartColors.value.border,
						borderDash: [4, 8],
					},
					pointLabels: {
						color: getCssVar('--text-500', 'rgba(255,255,255,0.96)'),
						font: {
							family: 'Roboto Flex Variable',
							size: 11,
							lineHeight: 1.8,
						},
					},
				},
			},
		},
	});
});

onUnmounted(() => {
	chart.value?.destroy();
});
</script>

<template>
	<div :class="classes.analystRatingsRadarChart">
		<canvas ref="container"></canvas>
	</div>
</template>

<style module="classes">
.analystRatingsRadarChart {
	width: 100%;
	height: 200px;
}
</style>
