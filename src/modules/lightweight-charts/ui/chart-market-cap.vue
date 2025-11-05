<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { type CSSProperties, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { sub } from 'date-fns';

import { type IChartMarketCapDataset } from '../model';
import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import { MarketCapDateRange } from '@/modules/widgets/market-cap/model';
import { prettyNumberWithKey } from '@/shared/lib';

interface IChartMarketCapProps {
	height: CSSProperties['height'];
	hideAxis?: boolean;
	range: MarketCapDateRange;
	datasets: IChartMarketCapDataset[];
}

const props = defineProps<IChartMarketCapProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();

const DEFAULT_VERTICAL_AXIS = {
	type: 'linear',
	position: 'right',
	display: true,
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
};

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
	[MarketCapDateRange.Day]: {
		min: sub(new Date(), { days: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'hour',
		},
	},
	[MarketCapDateRange.Week]: {
		min: sub(new Date(), { days: 7 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[MarketCapDateRange.Month]: {
		min: sub(new Date(), { days: 30 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[MarketCapDateRange.SixMonths]: {
		min: sub(new Date(), { days: 180 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'day',
		},
	},
	[MarketCapDateRange.Year]: {
		min: sub(new Date(), { years: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'month',
		},
	},
	[MarketCapDateRange.All]: {
		min: sub(new Date(), { years: 1 }).getTime(),
		max: Date.now(),
		time: {
			unit: 'month',
		},
	},
};

const EMPTY_AXES_OPTIONS = {
	y: { display: false },
	x: { type: 'time', display: false },
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
watch(() => props.hideAxis, updateChartScales);

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '$',
	reversed: true,
	transformRowValue: (rowValue: string) => {
		const normalizedDecimal = rowValue.replace(/[^\d,]+/g, '').replace(',', '.');
		const pretty = prettyNumberWithKey(normalizedDecimal, 2);

		return `${pretty.value}${pretty.suffix}`;
	},
});

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
