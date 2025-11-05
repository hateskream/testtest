<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { type CSSProperties, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import 'chartjs-adapter-date-fns';
import { Chart } from 'chart.js/auto';
import { sub } from 'date-fns';

import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import { DominanceDateRange } from '@/modules/widgets/bitcoin-dominance/model';
import type { IChartDominanceDataset } from '../model';

interface IChartDominanceProps {
	height: CSSProperties['height'];
	hideAxis?: boolean;
	range: DominanceDateRange;
	datasets: IChartDominanceDataset[];
}

const props = withDefaults(defineProps<IChartDominanceProps>(), {
	hideAxis: false,
});

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();

const EMPTY_AXES_OPTIONS = {
	y: { display: false },
	x: { type: 'time', display: false },
};

const DEFAULT_VERTICAL_AXIS = {
	type: 'linear',
	position: 'right',
	display: true,
	min: 0,
	max: 100,
	ticks: {
		maxTicksLimit: 6,
		color: 'rgba(154, 154, 157, 1)',
		callback: function (value: string) {
			return value + '%';
		},
	},
	grid: {
		display: true,
		color: '#373737',
		circular: true,
	},
	border: {
		dash: [2, 5],
	},
};


function buildDatasets() {
	return props.datasets.map(history => {
		return {
			label: history.label,
			data: history.points,
			borderColor: history.color,
			order: history.order,
			borderWidth: 2,
			type: 'line',
			fill: true,
			pointStyle: false,
			animation: false,
			backgroundColor: (context) => {
				if (!context.chart.chartArea) {
					return;
				}

				const { chart: currentChart } = context;

				return createGradient(
					currentChart.ctx,
					currentChart.chartArea.top,
					currentChart.chartArea.bottom,
					history.color,
				);
			},
			tension: 0.4,
			cubicInterpolationMode: 'monotone',
		};
	});
}

function updateChartDatasets() {
	if (!chart.value) {
		return;
	}

	chart.value.data.datasets = buildDatasets();
	chart.value.options.scales = buildScales();

	chart.value.update();
}

const rangeToScales = {
	[DominanceDateRange.Day]: {
		min: sub(new Date(), { days: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'hour',
		},
	},
	[DominanceDateRange.Week]: {
		min: sub(new Date(), { days: 7 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[DominanceDateRange.Month]: {
		min: sub(new Date(), { days: 30 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[DominanceDateRange.SixMonths]: {
		min: sub(new Date(), { days: 180 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[DominanceDateRange.Year]: {
		min: sub(new Date(), { years: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'month',
		},
	},
	[DominanceDateRange.All]: {
		min: sub(new Date(), { years: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'month',
		},
	},
};

function buildScales() {
	return props.hideAxis ? EMPTY_AXES_OPTIONS : {
		y: DEFAULT_VERTICAL_AXIS,
		x: {
			type: 'time',
			ticks: {
				maxTicksLimit: 12,
				color: 'rgba(154, 154, 157, 1)',
			},
			...rangeToScales[props.range],
		},
	};
}

watch(() => props.datasets, updateChartDatasets, { deep: true });

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '%',
	valuePrefix: '',
	reversed: true,
	transformTitle: (title) => {
		return [(new Date(title[0])).toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		})];
	},
});

function createGradient(context2D: CanvasRenderingContext2D, from: number, to: number, color: string) {
	const gradient = context2D.createLinearGradient(0, from, 0, to);

	gradient.addColorStop(0, color);
	gradient.addColorStop(1, 'rgba(0,0,0,0.85)');

	return gradient;
}

onMounted(() => {
	if (!container.value) {
		return;
	}

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			datasets: buildDatasets(),
		},
		options: {
			maintainAspectRatio: false,
			layout: {
				autoPadding: false,
			},
			normalized: true,
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			hover: { mode: 'dataset' },
			plugins: {
				legend: { display: false },
				tooltip: {
					enabled: false,
					position: 'nearest',
					external: handler,
				},
			},
			scales: buildScales(),
		},
	});
});

onUnmounted(() => {
	if (chart.value) {
		chart.value.destroy();
	}
});
</script>

<template>
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>
	</div>
	<teleport to="body">
		<chart-external-tooltip v-bind="state" />
	</teleport>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	width: 100%;
	height: v-bind(height);
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}
</style>
