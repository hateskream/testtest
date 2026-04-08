<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import { Chart, type ChartDataset, type ChartOptions } from 'chart.js/auto';
import type { TooltipOptions } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

import type { MarginSeries } from '../../model';
import { ChartExternalTooltip } from '@/modules/charts/chart-js';
import { preventLabelOverlapPlugin, underlineDashTicksPlugin } from '@/modules/charts/chart-js/plugins';
import { createPointerLabel, formatPercent } from '@/modules/charts/common/lib';
import { useExternalTooltip } from '@/modules/charts/chart-js/composables';

interface IMarginTrendsChartProps {
	height: number;
	series: MarginSeries[];
}

const props = defineProps<IMarginTrendsChartProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart<'line'> | null>(null);

const datasets = computed((): ChartDataset<'line'>[] => {
	return props.series.map((series) => {
		return {
			label: series.label,
			data: series.points.map((point) => point.value),
			borderColor: series.color,
			borderWidth: 2,
			borderDash: series.isDashed ? [4, 4] : [],
			pointRadius: 0,
			pointHoverRadius: 3,
			pointHoverBackgroundColor: series.color,
			fill: false,
			tension: 0.3,
		};
	});
});

const labels = computed(() => {
	if (!props.series.length || !props.series[0].points.length) {
		return [];
	}

	return props.series[0].points.map((point) => String(point.year));
});

function buildAnnotations() {
	return Object.fromEntries(props.series.map((entry) => {
		const label = createPointerLabel(
			`${formatPercent(entry.currentValue)}%`,
			entry.backgroundColor,
			entry.color,
		);

		return [
			entry.key,
			{
				type: 'line' as const,
				yMin: entry.currentValue,
				yMax: entry.currentValue,
				borderWidth: 0,
				label: {
					display: true,
					content: label,
					position: 'end' as const,
					xAdjust: 28,
					padding: 0,
					z: 10,
					backgroundColor: 'transparent',
				},
			},
		];
	}));
}

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '%',
	valuePrefix: '',
	targetEl: container,
});

const chartOptions: ChartOptions<'line'> = {
	maintainAspectRatio: false,
	normalized: true,
	responsive: true,
	animation: false,
	interaction: {
		mode: 'index',
		intersect: false,
	},
	plugins: {
		legend: { display: false },
		tooltip: {
			enabled: false,
			external: handler as unknown as TooltipOptions<'line'>['external'],
			itemSort: (a, b) => (b.raw as number) - (a.raw as number),
		},
		annotation: {
			clip: false,
			annotations: buildAnnotations(),
		},
		underlineDashTicks: {
			scales: ['y'],
		},
	},
	layout: {
		padding: 0,
	},
	scales: {
		y: {
			position: 'right',
			grid: {
				display: true,
				color: 'rgba(73, 73, 80, 0.60)',
				circular: true,
				drawTicks: false,
			},
			border: {
				dash: [2, 2],
			},
			ticks: {
				maxTicksLimit: 6,
				align: 'end',
				crossAlign: 'far',
				labelOffset: -5,
				callback: (value) => `${formatPercent(value as number)}%`,
				font: {
					family: '\'Roboto Flex Variable\', sans-serif',
					size: 10,
					weight: 400,
					lineHeight: '17.2px',
				},
				color: '#9A9A9D',
			},
		},
		x: {
			display: false,
			grid: { display: false },
			border: { display: false },
		},
	},
};

function createChart(): void {
	if (!container.value) {
		return;
	}

	if (chart.value) {
		chart.value.destroy();
	}

	chart.value = new Chart(container.value, {
		type: 'line',
		data: {
			labels: toRaw(labels.value),
			datasets: toRaw(datasets.value),
		},
		plugins: [underlineDashTicksPlugin, preventLabelOverlapPlugin],
		options: chartOptions,
	});
}

onMounted(() => {
	Chart.register(annotationPlugin);

	createChart();
});

onUnmounted(() => {
	if (chart.value) {
		chart.value.destroy();
		chart.value = null;
	}
});

function updateChartData(): void {
	const instance = chart.value;

	if (!instance) {
		return;
	}

	instance.data.labels = toRaw(labels.value);
	instance.data.datasets = toRaw(datasets.value);

	const annotationOptions = instance.options.plugins?.annotation;

	if (annotationOptions) {
		annotationOptions.annotations = buildAnnotations();
	}

	instance.update();
}

watch(
	() => props.series,
	() => {
		if (!chart.value) {
			createChart();
			return;
		}

		updateChartData();
	},
	{ deep: true },
);
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.chart" :style="{ height: `${props.height}px` }">
			<canvas ref="container" />
		</div>
		<teleport to="body">
			<chart-external-tooltip v-bind="state" width="auto" />
		</teleport>
	</div>
</template>

<style module="classes">
.wrapper {
	width: 100%;
}

.chart {
	position: relative;
	min-height: 0;
	padding: 0 var(--padding-s11, 20px) var(--padding-s19, 16px);
}
</style>
