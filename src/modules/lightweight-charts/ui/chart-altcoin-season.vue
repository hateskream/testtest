<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

import { getExternalTooltipVaults } from '../utils';
import type { IChartData } from '@/modules/widgets/altcoinSeason/model';
import {
	ALTCOIN_THRESHOLD,
	BITCOIN_THRESHOLD,
	DATA_CAP,
	graphActiveColor,
	graphColor,
	MIDDLE_THRESHOLD,
	widgetActiveColor,
	widgetColor,
} from '@/modules/widgets/altcoinSeason/const';

const props = defineProps<{
	show: boolean;
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

function pickQuarter(rank: number) {
	if (rank <= BITCOIN_THRESHOLD) {
		return {
			type: 'btc',
			yMin: 0,
			yMax: BITCOIN_THRESHOLD,
			bg: graphActiveColor.bitcoinSeason,
			stroke: widgetColor.bitcoinSeason,
		};
	} else if (rank <= MIDDLE_THRESHOLD) {
		return {
			type: 'neutralLow',
			yMin: BITCOIN_THRESHOLD,
			yMax: MIDDLE_THRESHOLD,
			bg: 'transparent',
			stroke: '#fff',
		};
	} else if (rank <= ALTCOIN_THRESHOLD) {
		return {
			type: 'neutralHigh',
			yMin: MIDDLE_THRESHOLD,
			yMax: ALTCOIN_THRESHOLD,
			bg: 'transparent',
			stroke: '#fff',
		};
	}

	return {
		type: 'alt',
		yMin: ALTCOIN_THRESHOLD,
		yMax: DATA_CAP,
		bg: graphActiveColor.altcoinSeason,
		stroke: widgetColor.altcoinSeason,
	};
}

watch(() => props.chartData.labels, (labels) => {
	if (!chart.value) {
		return;
	}

	chart.value.data.labels = [...labels];
	chart.value.update();
});

watch(() => props.chartData.metrics, (metrics) => {
	if (!chart.value) {
		return;
	}

	chart.value.data.datasets[0].data = [...metrics];
	chart.value.update();
});

onMounted(() => {
	if (chart.value) {
		return;
	}

	Chart.register(annotationPlugin);

	const { labels, metrics } = props.chartData;

	const active = pickQuarter(props.btcRank);
	const borderDash = [3, 3];

	const annotations = {
		below: {
			type: 'box',
			yMin: 0,
			yMax: active.yMin,
			backgroundColor: 'rgba(0,0,0,0.5)',
			borderWidth: 0,
		},
		above: {
			type: 'box',
			yMin: active.yMax,
			yMax: DATA_CAP,
			backgroundColor: 'rgba(0,0,0,0.5)',
			borderWidth: 0,
		},
		active: {
			type: 'box',
			yMin: active.yMin,
			yMax: active.yMax,
			backgroundColor: active.bg,
			borderWidth: 0,
		},

		topLine: {
			type: 'line',
			yMin: active.yMax,
			yMax: active.yMax,
			borderColor: active.stroke,
			borderWidth: 2,
			borderDash,
		},
		bottomLine: {
			type: 'line',
			yMin: active.yMin,
			yMax: active.yMin,
			borderColor: active.stroke,
			borderWidth: 2,
			borderDash,
		},

		neutralLine: {
			type: 'line',
			yMin: MIDDLE_THRESHOLD,
			yMax: MIDDLE_THRESHOLD,
			borderColor: 'rgba(255,255,255,0.6)',
			borderWidth: 1,
			borderDash,
		},
		btcThreshold: {
			type: 'line',
			yMin: BITCOIN_THRESHOLD,
			yMax: BITCOIN_THRESHOLD,
			borderColor: 'rgba(255,255,255,0.6)',
			borderWidth: 1,
			borderDash,
		},
		altcoinThreshold: {
			type: 'line',
			yMin: ALTCOIN_THRESHOLD,
			yMax: ALTCOIN_THRESHOLD,
			borderColor: 'rgba(255,255,255,0.6)',
			borderWidth: 1,
			borderDash,
		},

		btcThresholdBox: {
			type: 'box',
			yMin: 0,
			yMax: BITCOIN_THRESHOLD,
			backgroundColor: active.type !== 'btc' ? graphColor.bitcoinSeason : 'transparent',
			borderWidth: 0,
		},
		altcoinThresholdBox: {
			type: 'box',
			yMin: ALTCOIN_THRESHOLD,
			yMax: 30,
			backgroundColor: active.type !== 'alt' ? graphColor.altcoinSeason : 'transparent',
			borderWidth: 0,
		},
	} as const;

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels: labels.slice(),
			datasets: [
				{
					data: metrics.slice(),
					borderColor: widgetActiveColor.neutralSeason,
					borderWidth: 2,
					pointStyle: false,
					backgroundColor: widgetColor.neutralSeason,
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
					annotations: annotations,
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

watch(() => props.show, (value) => {
	if (!value && chart.value) {
		chart.value.destroy();
	}
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
