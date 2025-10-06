<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

import { getExternalTooltipVaults } from '../utils';
import type { IChartData } from '@/modules/widgets/altcoinSeason/model';
import { ALTCOIN_THRESHOLD, BITCOIN_THRESHOLD, DATA_CAP } from '@/modules/widgets/altcoinSeason/const';

const props = defineProps<{
	showX: boolean;
	showY: boolean;
	btcRank: number;
	chartData: IChartData;
}>();

const container = useTemplateRef('container');
const chart = ref<Chart>();

const legendsList = [
	{
		color: 'rgba(221, 246, 34, 1)',
		text: 'Data',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

onMounted(() => {
	const { labels } = props.chartData;

	Chart.register(annotationPlugin);

	const zone =
		props.btcRank <= BITCOIN_THRESHOLD
			? { yMin: 0, yMax: BITCOIN_THRESHOLD }
			: props.btcRank < ALTCOIN_THRESHOLD
				? { yMin: BITCOIN_THRESHOLD, yMax: ALTCOIN_THRESHOLD }
				: { yMin: ALTCOIN_THRESHOLD, yMax: 100 };

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					data: Array(labels.length).fill(ALTCOIN_THRESHOLD),
					backgroundColor: 'rgba(65, 59, 150, 0.1)',
					fill: 'end',
				},
				{
					data: props.chartData.metrics,
					borderColor: '#FEB358',
					borderWidth: 2,
					pointStyle: false,
					backgroundColor: 'rgba(254, 179, 88, 0.15)',
					fill: true,
					tension: 0.3,
				},
			],
		},
		options: {
			layout: {
				autoPadding: false,
			},
			maintainAspectRatio: false,
			normalized: true,
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			plugins: {
				annotation: {
					annotations: {
						below: {
							type: 'box',
							yMin: 0,
							yMax: zone.yMin,
							backgroundColor: 'rgba(0,0,0,0.5)',
							borderWidth: 0,
						},
						above: {
							type: 'box',
							yMin: zone.yMax,
							yMax: 100,
							backgroundColor: 'rgba(0,0,0,0.5)',
							borderWidth: 0,
						},
						active: {
							type: 'box',
							yMin: zone.yMin,
							yMax: zone.yMax,
							backgroundColor: 'transparent',
							borderWidth: 0,
						},
						topLine: {
							type: 'line',
							yMin: zone.yMax,
							yMax: zone.yMax,
							borderColor: '#fff',
							borderWidth: 2,
							borderDash: [6, 4],
						},
						bottomLine: {
							type: 'line',
							yMin: zone.yMin,
							yMax: zone.yMin,
							borderColor: '#fff',
							borderWidth: 2,
							borderDash: [6, 4],
						},
					},
				},
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false,
					position: 'nearest',
					external: externalTooltipHandler,
				},
			},

			scales: {
				y: {
					display: props.showY,
					type: 'linear',
					suggestedMax: DATA_CAP,
					position: 'right',

					grid: {
						color: '#373737',
						display: false,
					},

					ticks: {
						padding: 20,
						autoSkip: true,
						font: {
							size: 10,
						},
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value;
						},
					},


					border: {
						dash: [2, 2],
					},
				},
				x: {
					display: props.showX,
					ticks: {
						padding: 10,
					},

					grid: {
						display: false,
					},

					border: {
						display: false,
					},
				},

			},
		},
	});
});


</script>

<template>
	<div :class="classes.wrapper">
		<span :class="classes.title">
			Chart
		</span>
		<div :class="classes.chartContainer">
			<canvas ref="container" :class="classes.mainChart"></canvas>
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.title {
	padding: 12px 16px;
	font-style: normal;
	font-weight: 440;
	font-size: 12px;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.08px;
	text-overflow: ellipsis;
}

.chartContainer {
	height: 100%;
	min-height: 175px;
	margin-bottom: 9px;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}
</style>
