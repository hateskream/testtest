<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import { Chart, type ChartDataset, type ChartOptions } from 'chart.js/auto';
import type { TooltipOptions } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { addDays } from 'date-fns';

import type { SeasonalSeries } from '../../model';
import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import { solidBottomLinePlugin, underlineDashTicksPlugin } from '@/modules/lightweight-charts/plugins';
import { formatPercent } from '@/modules/lightweight-charts/model';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import { getDateFormatter, hexToRgba } from '@/shared/lib';

import SeasonalsChartLegend from './seasonals-chart-legend.vue';

interface ISeasonalsChartProps {
	currency: string;
	height: number;
	series: SeasonalSeries[];
}

const props = defineProps<ISeasonalsChartProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart<'line'> | null>(null);

function generateLabelColor(color: string) {
	const { r, g, b } = hexToRgba(color);

	const avg = (r + g + b) / 3;

	const nr = Math.round(r * 0.35 + avg * 0.65);
	const ng = Math.round(g * 0.35 + avg * 0.65);
	const nb = Math.round(b * 0.35 + avg * 0.65);

	const dr = Math.round(nr * 0.25);
	const dg = Math.round(ng * 0.25);
	const db = Math.round(nb * 0.25);

	return `rgb(${ dr }, ${ dg }, ${ db })`;
}

const datasets = computed((): ChartDataset<'line'>[] => {
	return props.series.map((series) => {
		const dayOfYearData = series.points.map((point, key) => ({ x: key + 1, y: point.changePct }));

		return {
			label: String(series.year),
			data: dayOfYearData,
			borderColor: series.color,
			borderWidth: 2,
			pointRadius: 0,
			pointHoverRadius: 3,
			pointHoverBackgroundColor: series.color,
			fill: false,
			tension: 0.3,
			parsing: false,
		};
	});
});

const labels = computed(() => {
	const maxDays = 365;
	const result: string[] = [];

	for (let i = 0; i <= maxDays; i++) {
		result.push(String(i));
	}

	return result;
});

function buildAnnotations() {
	return Object.fromEntries(props.series.map(entry => {
		return [
			entry.year,
			{
				type: 'line' as const,
				yMin: entry.ytdChangePct,
				yMax: entry.ytdChangePct,
				borderWidth: 0,
				label: {
					display: true,
					content: `${entry.year}   ${entry.ytdChangePct}%`,
					position: 'end' as const,
					xAdjust: 30,
					backgroundColor: generateLabelColor(entry.color),
					color: entry.color,
					font: {
						family: '\'Roboto Flex Variable\', sans-serif',
						size: 9,
						weight: 520,
						lineHeight: '16.2px',
					},
					padding: { x: 6, y: 0 },
					z: 10,
				},
			},
		];
	}));
}

// tooltip

const formatter = getDateFormatter({ day: 'numeric', month: 'short' });

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '%',
	valuePrefix: '',
	transformTitle: title => {
		const date = new Date(2000, 0, 0);

		return [formatter.format(addDays(date, Number(title)))];
	},
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
		},
		annotation: {
			clip: false,
			annotations: buildAnnotations(),
		},
		underlineDashTicks: {
			scales: ['y'],
		},
		solidBottomLine: {
			color: 'rgba(73, 73, 80, 0.44)',
			mode: 'full',
		},
	},
	scales: {
		y: {
			position: 'right',
			grid: {
				display: true,
				color: (context) => {
					if (context.index > 0) {
						return '#373737';
					}

					return undefined;
				},
				circular: true,
				drawTicks: false,
			},
			border: {
				dash: [2, 2],
			},
			ticks: {
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
			type: 'linear',
			min: 0,
			max: 382,
			ticks: { display: false },
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
		plugins: [underlineDashTicksPlugin, solidBottomLinePlugin],
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
		<seasonals-chart-legend />
		<teleport to="body">
			<chart-external-tooltip v-bind="state" />
		</teleport>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.chart {
	position: relative;
	min-height: 0;
	padding: 0 var(--padding-s11, 20px);
}
</style>
