<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue';
import { Chart, type ChartOptions, type Point } from 'chart.js';
import annotationPlugin, { type PartialEventContext } from 'chartjs-plugin-annotation';

import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import {
	formatPrice,
	millisecondsToUtcMilliseconds,
	strTimeToChartTime,
	type UtcSeconds,
} from '@/modules/lightweight-charts/model';
import { barSolidBottomLinePlugin, barUnderlineTicksPlugin } from '@/modules/lightweight-charts/plugins';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import { UiText } from '@/shared/ui/text';
import type { PriceTargetHistoryPoint } from '../../model';

interface IPriceTargetChartProps {
	history: PriceTargetHistoryPoint[];
	targetHigh: number;
	targetAverage: number;
	targetLow: number;
	height?: number;
}

const props = withDefaults(defineProps<IPriceTargetChartProps>(), {
	height: 250,
});

const lastPoint = computed(() => props.history[props.history.length - 1]);
const lastPrice = computed(() => lastPoint.value.close);
const lastTime = computed(() => strTimeToChartTime(lastPoint.value.timestamp));

const container = useTemplateRef('container');
const chart = shallowRef<Chart<'line'> | null>(null);

function generateCurvedLine(
	startTime: UtcSeconds,
	startPrice: number,
	endPrice: number,
	days: number = 365,
	pointCount: number = 20,
): Point[] {
	const result: Point[] = [];

	const totalSeconds = days * 24 * 60 * 60;
	const delta = endPrice - startPrice;

	for (let i = 0; i < pointCount; i++) {
		const t = i / (pointCount - 1);

		const eased = 1 - Math.pow(1 - t, 2);

		const value = startPrice + delta * eased;
		const time = startTime + Math.round(totalSeconds * t);

		result.push({
			x: millisecondsToUtcMilliseconds(time * 1000),
			y: value,
		});
	}

	return result;
}

function getForecastColor(target: number, currentPrice: number) {
	return target >= currentPrice ? '#04EDA0' : '#FC4A6B';
}

function getForecastAxisLabelColors(target: number, currentPrice: number)
	: { axisLabelColor: string; axisLabelTextColor: string } {
	if (target >= currentPrice) {
		return { axisLabelColor: '#162D27', axisLabelTextColor: '#04EDA0' };
	}

	return { axisLabelColor: '#301219', axisLabelTextColor: '#FC1D4D' };
}

function gradient(context: PartialEventContext) {
	const { element, chart: { ctx } } = context;

	if (!element) {
		return 'transparent';
	}

	const g = ctx.createLinearGradient(element.x!, element.y!, element.x!, element.y2!);

	if (props.targetAverage > lastPrice.value) {
		g.addColorStop(0, 'rgba(4, 237, 160, 0.2)');
		g.addColorStop(1, 'rgba(4, 237, 160, 0.05)');
	} else {
		g.addColorStop(0, 'rgba(252, 74, 107, 0.1)');
		g.addColorStop(0.5, 'rgba(252, 74, 107, 0.15)');
		g.addColorStop(1, 'rgba(252, 74, 107, 0.3)');
	}

	return g;
}

function buildTargetAnnotation(
	target: number,
	label: string,
	currentPrice: number,
) {
	const { axisLabelColor, axisLabelTextColor } = getForecastAxisLabelColors(target, currentPrice);

	return {
		type: 'line' as const,
		yMin: target,
		yMax: target,
		borderDash: [2, 2],
		borderColor: 'transparent',
		borderWidth: 0,
		label: {
			display: true,
			content: `${label}  ${formatPrice(target)}`,
			position: 'end' as const,
			xAdjust: 30,
			backgroundColor: axisLabelColor,
			color: axisLabelTextColor,
			font: {
				family: '\'Roboto Flex Variable\', sans-serif',
				size: 9,
				weight: 520,
				lineHeight: '16.2px',
			},
			padding: { x: 6, y: 0 },
			z: 10,
		},
	};
}

function buildAnnotations() {
	const currentPrice = lastPrice.value;

	return {
		lastPrice: {
			type: 'line' as const,
			yMin: currentPrice,
			yMax: currentPrice,
			borderDash: [2, 2],
			borderColor: '#fff',
			borderWidth: 2,
			label: {
				display: true,
				content: `C  ${formatPrice(currentPrice)}`,
				position: 'end' as const,
				xAdjust: 30,
				backgroundColor: '#323537',
				color: '#fff',
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
		targetHigh: buildTargetAnnotation(props.targetHigh, 'H', currentPrice),
		targetAverage: buildTargetAnnotation(props.targetAverage, 'A', currentPrice),
		targetLow: buildTargetAnnotation(props.targetLow, 'L', currentPrice),
		box: {
			type: 'box' as const,
			backgroundColor: (context: PartialEventContext) => gradient(context),
			borderWidth: 0,
			yMax: Math.max(props.targetAverage, currentPrice),
			yMin: Math.min(props.targetAverage, currentPrice),
			xMin: props.history[props.history.length - 1].timestamp,
		},
	};
}

function createForecastDataset(value: number, label: string) {
	const price = lastPrice.value;

	const data = generateCurvedLine(lastTime.value, price, value);

	return {
		label,
		data,
		borderColor: getForecastColor(value, price),
		borderDash: [2, 2],
		tension: 0.4,
		pointRadius: 0,
		borderWidth: 2,
		hoverRadius: 0,
		pointHitRadius: 0,
	};
}

function buildDatasets() {
	const mainDataset = {
		label: 'Price',
		data: props.history.map(point => ({
			x: Date.parse(point.timestamp),
			y: point.close,
		})),
		borderColor: '#fff',
		borderWidth: 2,
		pointRadius: 0,
	};

	return [
		mainDataset,
		createForecastDataset(props.targetHigh, 'High'),
		createForecastDataset(props.targetLow, 'Low'),
		createForecastDataset(props.targetAverage, 'Average'),
	];
}

// chart

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '',
});

const defaultOptions: ChartOptions<'line'> = {
	responsive: true,
	maintainAspectRatio: false,
	animation: false,
	interaction: {
		intersect: false,
	},
	plugins: {
		legend: { display: false },
		tooltip: {
			intersect: false,
			enabled: false,
			external: (ctx) => {
				if (ctx.tooltip.body.length) {
					handler(ctx);
				} else {
					state.visible = false;
				}
			},
			filter: (item) => item.datasetIndex === 0,
		},
		annotation: {
			annotations: {},
		},
	},
	scales: {
		y: {
			position: 'right',
			grid: {
				display: true,
				color: (context) => {
					if (context.index > 0) {
						return 'rgba(73, 73, 80, 0.44)';
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
				callback: value => formatPrice(Number(value)),
				backdropColor: 'red',
				font: {
					family: '\'Roboto Flex Variable\', sans-serif',
					size: 11,
					weight: 400,
					lineHeight: '19.8px',
				},
				color: 'rgba(255, 255, 255, 0.62)',
			},
		},
		x: {
			type: 'time',
			display: false,
			ticks: {
				padding: 10,
				font: {
					family: '\'Roboto Flex Variable\', sans-serif',
					size: 11,
					weight: 400,
					lineHeight: '19.8px',
				},
				color: 'rgba(255, 255, 255, 0.30)',
			},
			grid: { display: false },
			border: { display: false },
			stacked: false,
		},
	},
};

function createPriceTargetChart() {
	if (!container.value) {
		return;
	}

	if (chart.value) {
		chart.value.destroy();
	}

	chart.value = new Chart(container.value, {
		type: 'line',
		data: {
			datasets: buildDatasets(),
		},
		plugins: [barUnderlineTicksPlugin, barSolidBottomLinePlugin],
		options: {
			...defaultOptions,
			plugins: {
				...defaultOptions.plugins,
				annotation: {
					clip: false,
					annotations: buildAnnotations(),
				},
			},
		},
	});
}

function destroyChart(): void {
	if (chart.value) {
		chart.value.destroy();
		chart.value = null;
	}
}

onMounted(() => {
	if (!container.value) {
		return;
	}

	Chart.register(annotationPlugin);

	createPriceTargetChart();
});

function updateChartData() {
	const instance = chart.value;

	if (!instance) {
		return;
	}

	instance.data.datasets = buildDatasets();

	const pluginOptions = instance.options.plugins?.annotation;
	if (pluginOptions && 'annotations' in pluginOptions) {
		pluginOptions.annotations = buildAnnotations();
	}

	instance.update();
}

watch(() => [
	props.history,
	props.targetHigh,
	props.targetAverage,
	props.targetLow,
],
() => {
	updateChartData();
}, { deep: true });

onBeforeUnmount(destroyChart);
</script>

<template>
	<div
		:class="classes.wrapper"
		:style="{ height: `${props.height}px` }"
	>
		<div :style="{ height: `${props.height - 40}px` }">
			<canvas
				ref="container"
				:class="classes.chart"
			></canvas>
		</div>
		<div :class="classes.legend">
			<div :class="classes.legendItem">
				<ui-text token="text-50-r">Past 2Y</ui-text>
			</div>
			<div :class="classes.legendItem">
				<ui-text token="text-50-r">1Y Forecast</ui-text>
			</div>
		</div>
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

.legend {
	display: grid;
	flex-shrink: 0;
	align-items: center;
	height: 40px;
	padding-right: var(--padding-s17, 44px);
	text-align: center;
	grid-template-columns: 2fr 1fr;
}

.legendItem {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
