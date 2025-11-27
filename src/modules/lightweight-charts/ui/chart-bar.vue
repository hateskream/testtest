<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import { Chart, type ChartDataset, type ChartOptions, type Plugin } from 'chart.js/auto';

import { barSolidBottomLinePlugin, barUnderlineTicksPlugin } from '@/modules/lightweight-charts/plugins';
import { prettyNumberWithKey } from '@/shared/lib';

export type BarDataset = ChartDataset<'bar'>;

export interface IChartBarProps {
	datasets: BarDataset[];
	labels: string[];
	plugins?: Plugin[];
	options?: ChartOptions<'bar'>;
	beginAtZero?: boolean;
}

const props = withDefaults(defineProps<IChartBarProps>(), {
	plugins: () => [],
	options: () => ({}),
});

const container = useTemplateRef('container');
const chart = shallowRef<Chart<'bar'> | null>(null);

const preparedPlugins = computed(() => {
	return [...props.plugins, barUnderlineTicksPlugin, barSolidBottomLinePlugin];
});

const defaultOptions: ChartOptions<'bar'> = {
	maintainAspectRatio: false,
	normalized: true,
	responsive: true,
	plugins: {
		legend: { display: false },
		tooltip: { enabled: false },
	},
	scales: {
		y: {
			beginAtZero: props.beginAtZero,
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
				callback: (value) => {
					const pretty = prettyNumberWithKey(value.toString());
					return `${pretty.value}${pretty.suffix}`;
				},
			},
		},
		x: {
			ticks: { padding: 10 },
			grid: { display: false },
			border: { display: false },
			stacked: false,
		},
	},
};

function createChart() {
	if (!container.value) {
		return;
	}

	if (chart.value) {
		chart.value.destroy();
	}

	chart.value = new Chart(container.value, {
		type: 'bar',
		data: {
			datasets: props.datasets,
			labels: props.labels,
		},
		plugins: preparedPlugins.value,
		options: {
			...defaultOptions,
			...props.options,
		},
	});
}

onMounted(createChart);

onUnmounted(() => {
	if (chart.value) {
		chart.value.destroy();
		chart.value = null;
	}
});

function updateChartData() {
	const instance = chart.value;

	if (!instance) {
		return;
	}

	instance.data.labels = toRaw(props.labels);
	instance.data.datasets = toRaw(props.datasets);

	instance.update();
}

watch(
	() => [props.labels, props.datasets],
	() => {
		if (!chart.value) {
			createChart();
			return;
		}

		updateChartData();
	},
	{ deep: true },
);

watch(() => props.options, (value) => {
	const instance = chart.value;

	if (!instance) {
		return;
	}

	instance.options = { ...defaultOptions, ...value };
	instance.update();
}, { deep: true });
</script>

<template>
	<canvas ref="container"  />
</template>
