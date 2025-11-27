<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import { Chart, type ChartDataset, type ChartOptions, type Plugin } from 'chart.js/auto';

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
			grid: { display: true, color: '#373737', circular: true },
			border: { dash: [2, 5] },
		},
		x: {
			ticks: { padding: 10 },
			grid: { display: false },
			border: { display: false },
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
		plugins: props.plugins,
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
