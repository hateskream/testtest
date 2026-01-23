<script setup lang="ts">
// oxlint-disable-next-line typescript/ban-ts-comment
// @ts-nocheck
import { computed, type CSSProperties, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import 'chartjs-adapter-date-fns';
import { Chart } from 'chart.js/auto';
import { sub } from 'date-fns';
import { useElementSize } from '@vueuse/core';

import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import { DominanceDateRange } from '@/modules/widgets/bitcoin-dominance/model';
import type { IChartDominanceDataset } from '../model';
import { colorToRgba } from '@/shared/lib/color-to-rgba.ts';
import { CURRENT_LOCALE, FALLBACK_LOCALE, getDateFormatter, isFeatureEnabled } from '@/shared/lib';

interface IChartDominanceProps {
	height: CSSProperties['height'];
	hideAxis?: boolean;
	range: DominanceDateRange;
	datasets: IChartDominanceDataset[];
	locale?: string;
}

const props = withDefaults(defineProps<IChartDominanceProps>(), {
	hideAxis: false,
	locale: CURRENT_LOCALE,
});

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();

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
			stack: 'dominance',
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

// scales

const { width: wrapperWidth } = useElementSize(useTemplateRef('wrapper'));

const TICK_WIDTH = 70;

const maxTicksCount = computed(() => {
	return Math.ceil(wrapperWidth.value / TICK_WIDTH);
});

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
	return {
		x: {
			display: !props.hideAxis,
			type: 'time',
			ticks: {
				maxTicksLimit: maxTicksCount.value,
				color: 'rgba(154, 154, 157, 1)',
			},
			...rangeToScales[props.range],
		},
		y: {
			type: 'linear',
			position: 'right',
			display: !props.hideAxis,
			stacked: true,
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
		},
	};
}

watch(maxTicksCount, () => {
	if (chart.value) {
		chart.value.options.scales = buildScales();

		chart.value.update();
	}
});

watch(() => props.datasets, updateChartDatasets, { deep: true });

// locale

const localeIsEnabled = isFeatureEnabled('DATE_FORMAT_LOCALIZATION');

const chartLocale = computed(() => {
	if (props.locale) {
		return props.locale;
	}

	if (localeIsEnabled) {
		return CURRENT_LOCALE;
	}

	return FALLBACK_LOCALE;
});

watch(chartLocale, value => {
	if (chart.value && chart.value.options.locale !== value) {
		chart.value.options.locale = value;
		chart.value.update();
	}
});

// tooltip

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '%',
	valuePrefix: '',
	reversed: true,
	transformTitle: (title: string[]) => {
		const formatter = getDateFormatter({
			month: 'short',
			day: '2-digit',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZoneName: 'short',
			locale: chartLocale.value,
		});

		return title.map(item => {
			return formatter.format(item).replace('GMT', 'UTC');
		}).filter((t, key, array) => key === 0 || array[key - 1] !== t);
	},
});

// init

function createGradient(context2D: CanvasRenderingContext2D, from: number, to: number, color: string) {
	const gradient = context2D.createLinearGradient(0, from, 0, to);

	gradient.addColorStop(0, colorToRgba(color, 0.4));
	gradient.addColorStop(1, 'rgba(0, 0, 0, .8)');

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
					callbacks: {
						title: context => context.map(ctx => ctx.parsed.x),
					},
				},
			},
			scales: buildScales(),
			locale: chartLocale.value,
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
	<div ref="wrapper" :class="classes.wrapper">
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
