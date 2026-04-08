<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue';
import { Chart, type ChartOptions, type Point } from 'chart.js';
import annotationPlugin, { type PartialEventContext } from 'chartjs-plugin-annotation';
import { addMonths } from 'date-fns';
import { useEventListener } from '@vueuse/core';

import { ChartExternalTooltip } from '@/modules/charts/chart-js';
import { strTimeToChartTime } from '@/modules/charts/lightweight/model';
import { millisecondsToUtcMilliseconds, type UtcSeconds } from '@/modules/charts/common/model';
import { createSplitLabel, formatPrice } from '@/modules/charts/common/lib';
import { solidBottomLinePlugin, underlineDashTicksPlugin } from '@/modules/charts/chart-js/plugins';
import { useExternalTooltip } from '@/modules/charts/chart-js/composables';
import { UiText } from '@/shared/ui/text';
import { getForecastColor, getForecastLabelColors, getTriangleColor, type PriceTargetHistoryPoint } from '../../model';

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

function boxGradient(context: PartialEventContext) {
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

const LABEL_TOOLTIP_OFFSET = 5;

const { state: labelTooltipState } = useExternalTooltip({ targetEl: container, padding: 6 });

const LABEL_TOOLTIP_MAP: Record<string, string> = {
	lastPrice: 'Current',
	targetHigh: 'High',
	targetAverage: 'Average',
	targetLow: 'Low',
} as const;

function handleCanvasMouseMove(event: MouseEvent): void {
	const instance = chart.value;

	if (!instance) {
		return;
	}

	const rect = instance.canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;

	const elements = annotationPlugin.getAnnotations(instance);

	for (const el of elements) {
		const id = el.options?.id;

		if (!id || !(id in LABEL_TOOLTIP_MAP)) {
			continue;
		}

		const labelEl = el.label;

		if (!labelEl?.options?.display || !labelEl.inRange) {
			continue;
		}

		if (labelEl.inRange(mouseX, mouseY)) {
			labelTooltipState.visible = true;
			labelTooltipState.x = rect.left + labelEl.centerX;
			labelTooltipState.y = rect.top + labelEl.y2 + LABEL_TOOLTIP_OFFSET;
			labelTooltipState.title = [LABEL_TOOLTIP_MAP[id]];
			labelTooltipState.rows = [];
			return;
		}
	}

	labelTooltipState.visible = false;
}

function handleCanvasMouseLeave(): void {
	labelTooltipState.visible = false;
}

function buildTargetAnnotation(
	target: number,
	currentPrice: number,
	label: string,
) {
	const { label: labelColor, text: textColor } = getForecastLabelColors(target, currentPrice);

	const splitLabel = createSplitLabel(label, formatPrice(target), labelColor, textColor);

	return {
		type: 'line' as const,
		yMin: target,
		yMax: target,
		borderDash: [2, 2],
		borderColor: 'transparent',
		borderWidth: 0,
		label: {
			display: true,
			content: splitLabel,
			position: 'end' as const,
			xAdjust: 24,
			padding: 0,
			z: 10,
		},
	};
}

function buildAnnotations() {
	const currentPrice = lastPrice.value;

	const splitLabel = createSplitLabel('C', formatPrice(currentPrice), '#2E2E32', '#fff');

	const topBoxY = Math.max(props.targetAverage, currentPrice);
	const bottomBoxY = Math.min(props.targetAverage, currentPrice);
	const triangleX = addMonths(new Date(lastTime.value * 1000), 6).getTime();

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
				content: splitLabel,
				position: 'end' as const,
				xAdjust: 24,
				padding: 0,
				z: 10,
			},
		},
		targetHigh: buildTargetAnnotation(props.targetHigh, currentPrice, 'H'),
		targetAverage: buildTargetAnnotation(props.targetAverage, currentPrice, 'A'),
		targetLow: buildTargetAnnotation(props.targetLow, currentPrice, 'L'),
		box: {
			type: 'box' as const,
			backgroundColor: (context: PartialEventContext) => boxGradient(context),
			borderWidth: 0,
			yMax: topBoxY,
			yMin: bottomBoxY,
			xMin: props.history[props.history.length - 1].timestamp,
		},
		topTriangle: {
			type: 'point' as const,
			backgroundColor: getTriangleColor(props.targetAverage, currentPrice),
			pointStyle: 'triangle',
			borderWidth: 0,
			radius: 5.4,
			xValue: triangleX,
			yValue: topBoxY + 11,
			rotation: 180,
		},
		bottomTriangle: {
			type: 'point' as const,
			backgroundColor: getTriangleColor(props.targetAverage, currentPrice),
			pointStyle: 'triangle',
			borderWidth: 0,
			radius: 5.4,
			xValue: triangleX,
			yValue: bottomBoxY - 11,
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
	targetEl: container,
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
		plugins: [underlineDashTicksPlugin, solidBottomLinePlugin],
		options: {
			...defaultOptions,
			plugins: {
				...defaultOptions.plugins,
				annotation: {
					clip: false,
					annotations: buildAnnotations(),
				},
				solidBottomLine: {
					color: 'rgba(73, 73, 80, 0.44)',
					mode: 'full',
				},
				underlineDashTicks: {
					scales: ['y'],
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

useEventListener(container, 'mousemove', handleCanvasMouseMove);
useEventListener(container, 'mouseleave', handleCanvasMouseLeave);

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
	<div :class="classes.wrapper" :style="{ height: `${props.height}px` }">
		<div :style="{ height: `${props.height - 40}px` }">
			<canvas ref="container" :class="classes.chart"></canvas>
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
			<chart-external-tooltip width="auto" v-bind="labelTooltipState">
				<template #content="{ title }">
					<ui-text token="text-200-r">{{ title[0] }}</ui-text>
				</template>
			</chart-external-tooltip>
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
