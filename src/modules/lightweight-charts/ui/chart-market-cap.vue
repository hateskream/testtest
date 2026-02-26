<script setup lang="ts">
// oxlint-disable-next-line typescript/ban-ts-comment
// @ts-nocheck
import { computed, type CSSProperties, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { sub } from 'date-fns';

import { DateRangePreset, type DateRangeValue, formatPrice, type IChartMarketCapDataset } from '../model';
import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import { CURRENT_LOCALE, FALLBACK_LOCALE, getDateFormatter, isFeatureEnabled, prettyNumberWithKey } from '@/shared/lib';

interface IChartMarketCapProps {
	height: CSSProperties['height'];
	hideAxis?: boolean;
	range: DateRangeValue;
	datasets: IChartMarketCapDataset[];
	locale?: string;
}

const props = defineProps<IChartMarketCapProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();

function updateChartScales() {
	if (!chart.value) {
		return;
	}

	chart.value.options.scales = buildScales();
	chart.value.update();
}

function buildDatasets() {
	return props.datasets.map(history => {
		return {
			label: history.label,
			data: history.points,
			borderColor: history.color,
			borderWidth: 2,
			type: 'line',
			pointStyle: false,
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
	[DateRangePreset.Day]: {
		min: sub(new Date(), { days: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'hour',
		},
	},
	[DateRangePreset.Week]: {
		min: sub(new Date(), { days: 7 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[DateRangePreset.Month]: {
		min: sub(new Date(), { days: 30 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[DateRangePreset.SixMonths]: {
		min: sub(new Date(), { days: 180 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[DateRangePreset.Year]: {
		min: sub(new Date(), { years: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'month',
		},
	},
	[DateRangePreset.All]: {
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
				maxTicksLimit: 12,
				color: 'rgba(154, 154, 157, 1)',
			},
			...rangeToScales[props.range],
		},
		y: {
			display: !props.hideAxis,
			type: 'linear',
			position: 'right',
			ticks: {
				maxTicksLimit: 6,
				color: 'rgba(154, 154, 157, 1)',
				callback: function (value: string) {
					const pretty = prettyNumberWithKey(value, 2);

					return `${pretty.value}${pretty.suffix}`;
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

watch(() => props.datasets, updateChartDatasets, { deep: true });
watch(() => props.hideAxis, updateChartScales);

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
	valueSuffix: '',
	valuePrefix: '$',
	reversed: true,
	transformRowValue: formatPrice,
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

onMounted(() => {
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
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false,
					position: 'nearest',
					external: handler,
					callbacks: {
						title: context => context.map(ctx => ctx.parsed.x),
						label: context => {
							return `${context.dataset.label}:${context.parsed.y}`;
						},
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
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>
		<teleport to="body">
			<chart-external-tooltip v-bind="state" />
		</teleport>
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	height: v-bind(height);
	min-height: 0;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}
</style>
