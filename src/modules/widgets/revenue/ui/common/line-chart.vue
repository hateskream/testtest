<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import { Chart, type ChartDataset, type ChartOptions } from 'chart.js/auto';
import type { TooltipOptions } from 'chart.js';

import { prettyNumberWithKey } from '@/shared/lib';
import { solidBottomLinePlugin, underlineDashTicksPlugin } from '@/modules/charts/chart-js/plugins';
import { useExternalTooltip } from '@/modules/charts/chart-js/composables';
import { ChartExternalTooltip } from '@/modules/charts/chart-js';
import { formatPrice } from '@/modules/charts/common/lib';
import { getYearlyPointColor, type RevenueYearlyPoint } from '../../model';

interface ILineChartProps {
	years: RevenueYearlyPoint[];
}

const props = defineProps<ILineChartProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart<'line'> | null>(null);

const preparedLabels = computed(() => props.years.map((point) => String(point.year)));

const preparedDataset = computed<ChartDataset<'line'>>(() => ({
	label: 'Revenue',
	data: props.years.map(p => p.value),
	borderWidth: 2,
	tension: 0,
	pointBorderWidth: 0,
	pointRadius: 4,
	pointBackgroundColor: (ctx) => {
		return getYearlyPointColor(props.years[ctx.dataIndex]);
	},
	pointBorderColor: (ctx) => {
		return getYearlyPointColor(props.years[ctx.dataIndex]);
	},
	segment: {
		borderColor: (ctx) => {
			return getYearlyPointColor(props.years[ctx.p0DataIndex]);
		},
	},
}));

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '',
	transformRowValue: value => formatPrice(Number(value.replaceAll(' ', ''))),
});

const defaultOptions: ChartOptions<'line'> = {
	maintainAspectRatio: false,
	normalized: true,
	responsive: true,
	plugins: {
		legend: { display: false },
		tooltip: {
			enabled: false,
			external: handler as unknown as TooltipOptions<'line'>['external'],
		},
		solidBottomLine: {
			color: 'rgba(73, 73, 80, 0.60)',
			mode: 'full',
		},
		underlineDashTicks: {
			scales: ['y'],
		},
	},
	scales: {
		y: {
			beginAtZero: true,
			position: 'right',
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
				callback: (value) => {
					const pretty = prettyNumberWithKey(value.toString());
					return `${pretty.value}${pretty.suffix}`;
				},
				font: {
					family: '\'Roboto Flex Variable\', sans-serif',
					size: 10,
					weight: 400,
					lineHeight: '17.2px',
				},
				color: 'rgba(255, 255, 255, 0.62)',
			},
		},
		x: {
			offset: true,
			ticks: {
				padding: 10,
				font: {
					family: '\'Roboto Flex Variable\', sans-serif',
					size: 10,
					weight: 400,
					lineHeight: '17.2px',
				},
				color: 'rgba(255, 255, 255, 0.62)',
			},
			grid: { display: false },
			border: { display: false },
		},
	},
};

const plugins = [underlineDashTicksPlugin, solidBottomLinePlugin];

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
			datasets: [toRaw(preparedDataset.value)],
			labels: toRaw(preparedLabels.value),
		},
		plugins,
		options: defaultOptions,
	});
}

onMounted(createChart);

onUnmounted(() => {
	if (chart.value) {
		chart.value.destroy();
		chart.value = null;
	}
});

watch(
	() => [preparedLabels.value, preparedDataset.value],
	() => {
		const instance = chart.value;

		if (!instance) {
			createChart();
			return;
		}

		instance.data.labels = toRaw(preparedLabels.value);
		instance.data.datasets = [toRaw(preparedDataset.value)];
		instance.update();
	},
	{ deep: true },
);
</script>

<template>
	<div>
		<canvas ref="container" />
		<teleport to="body">
			<chart-external-tooltip v-bind="state" />
		</teleport>
	</div>
</template>
