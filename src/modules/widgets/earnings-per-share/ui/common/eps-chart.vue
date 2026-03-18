<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import type { BubbleDataPoint, ChartOptions, TooltipOptions } from 'chart.js';
import { Chart } from 'chart.js/auto';
import annotationPlugin, { type AnnotationOptions } from 'chartjs-plugin-annotation';

import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import {
	bubbleDashedPointBorderPlugin,
	type IBubbleDatasetWithDash,
	solidBottomLinePlugin,
	underlineDashTicksPlugin,
} from '@/modules/lightweight-charts/plugins';
import { type EpsQuarter, EpsQuarterStatus, formatQuarterLabel } from '../../model';

const BUBBLE_RADIUS = 12;
const BEAT_COLOR = '#04EDA0';
const MISSED_COLOR = '#FC4A6B';
const ACTUAL_COLOR = '#FFFFFF';
const PREDICTION_BORDER_COLOR = '#FF7029';
const PREDICTION_BG_COLOR = 'rgba(255, 112, 41, 0.10)';

interface IEpsChartProps {
	quarters: EpsQuarter[];
	height?: number;
}

const props = defineProps<IEpsChartProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart<'bubble'> | null>(null);

const labels = computed(() => props.quarters.map(q => formatQuarterLabel(q.year, q.quarter)));

const actualDataset = computed((): BubbleDataPoint[] =>
	props.quarters.map((q, index) => ({
		x: index,
		y: q.actualEps ?? NaN,
		r: BUBBLE_RADIUS,
	})),
);

const predictionDataset = computed((): BubbleDataPoint[] =>
	props.quarters.map((q, index) => ({
		x: index,
		y: q.estimatedEps ?? NaN,
		r: BUBBLE_RADIUS,
	})),
);

function getEpsRange() {
	const allValues = props.quarters.flatMap(q =>
		[q.actualEps, q.estimatedEps].filter((v): v is number => v !== null),
	);

	if (allValues.length === 0) {
		return { min: 0, max: 10 };
	}

	const min = Math.min(...allValues);
	const max = Math.max(...allValues);
	const padding = (max - min) * 0.25 || 1;

	return {
		min: Math.max(0, min - padding),
		max: max + padding,
	};
}

function buildAnnotations() {
	const annotations: Record<string, AnnotationOptions> = {};

	props.quarters.forEach((quarter, index) => {
		if (!quarter.status) {
			return;
		}

		const isBeat = quarter.status === EpsQuarterStatus.Beat;
		const color = isBeat ? BEAT_COLOR : MISSED_COLOR;
		const epsRange = getEpsRange();

		annotations[`point-${index}`] = {
			type: 'point' as const,
			backgroundColor: color,
			borderColor: color,
			borderWidth: 1,
			pointStyle: 'triangle',
			rotation: 180,
			radius: 5,
			xValue: index,
			yValue: epsRange.max,
			yAdjust: -12,
		};

		annotations[`label-${index}`] = {
			type: 'label' as const,
			content: () => quarter.status,
			font: { size: 11, family: '\'Roboto Flex Variable\', sans-serif' },
			color,
			xValue: index,
			yValue: epsRange.max,
			yAdjust: -24,
		};
	});

	return annotations;
}

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '',
});

function buildChartOptions(): ChartOptions<'bubble'> {
	const epsRange = getEpsRange();

	return {
		maintainAspectRatio: false,
		normalized: true,
		responsive: true,
		layout: {
			autoPadding: false,
			padding: {
				top: 30,
			},
		},
		interaction: {
			mode: 'index',
			intersect: false,
		},
		plugins: {
			legend: { display: false },
			tooltip: {
				enabled: false,
				position: 'nearest',
				external: handler as unknown as TooltipOptions<'bubble'>['external'],
				callbacks: {
					label: value => `${value.dataset.label}:${value.parsed.y}`,
					title: value => {
						const [scale] = value;
						if (!scale) {
							return [];
						}

						const rawValue = scale.raw as { x: number; y: number };
						return labels.value[rawValue.x];
					},
				},
			},
			annotation: {
				clip: false,
				annotations: buildAnnotations(),
			},
			underlineDashTicks: {
				scales: ['y'],
			},
			solidBottomLine: {
				color: 'rgba(73, 73, 80, 0.60)',
				mode: 'full',
			},
		},
		scales: {
			y: {
				position: 'right',
				min: epsRange.min,
				max: epsRange.max,
				grid: {
					display: true,
					color: (context) => {
						if (context.index > 0) {
							return 'rgba(73, 73, 80, 0.60)';
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
					callback: (value) => Number(value).toFixed(2),
					font: {
						family: '\'Roboto Flex Variable\', sans-serif',
						size: 10,
					},
					color: 'rgba(255, 255, 255, 0.62)',
				},
			},
			x: {
				type: 'linear',
				offset: true,
				ticks: {
					color: 'rgba(255, 255, 255, 0.62)',
					padding: 10,
					font: {
						family: '\'Roboto Flex Variable\', sans-serif',
						size: 10,
						weight: 400,
					},
					callback: (value) => {
						const index = value as number;

						if (index >= 0 && index < props.quarters.length) {
							return labels.value[index];
						}
					},
				},
				grid: { display: false },
				border: { display: false },
			},
		},
	};
}

function createChart(): void {
	if (!container.value) {
		return;
	}

	if (chart.value) {
		chart.value.destroy();
	}

	chart.value = new Chart(container.value, {
		type: 'bubble',
		data: {
			datasets: [
				{
					label: 'Actual',
					data: toRaw(actualDataset.value),
					borderColor: ACTUAL_COLOR,
					backgroundColor: ACTUAL_COLOR,
				},
				{
					label: 'Prediction',
					data: toRaw(predictionDataset.value),
					borderColor: PREDICTION_BORDER_COLOR,
					backgroundColor: PREDICTION_BG_COLOR,
					borderWidth: 0,
					hoverBorderWidth: 0,
					pointBorderDash: [2, 2],
				},
			] as IBubbleDatasetWithDash[],
		},
		plugins: [underlineDashTicksPlugin, solidBottomLinePlugin, bubbleDashedPointBorderPlugin],
		options: buildChartOptions(),
	});
}

function updateChartData(): void {
	const instance = chart.value;
	if (!instance) {
		return;
	}

	instance.data.datasets[0].data = toRaw(actualDataset.value);
	instance.data.datasets[1].data = toRaw(predictionDataset.value);
	instance.options = buildChartOptions();

	const annotationOptions = instance.options.plugins?.annotation;

	if (annotationOptions) {
		annotationOptions.annotations = buildAnnotations();
	}

	instance.update();
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

watch(
	() => props.quarters,
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
	<div :class="classes.wrapper" :style="{ height: `${props.height}px` }">
		<canvas
			ref="container"
			:class="classes.chart"
		></canvas>
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
}

.chart {
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 0;
}
</style>
