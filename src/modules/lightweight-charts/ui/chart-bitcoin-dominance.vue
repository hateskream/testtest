<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue';
import { Chart } from 'chart.js/auto';

import { getExternalTooltipSplitted } from '../utils';


interface IChartProps {
	height: CSSProperties['height'];
	hideAxis?: boolean;
}

const props = withDefaults(defineProps<IChartProps>(), {
	hideAxis: false,
});


const generateRandomBars = () => {
	return Array.from({ length: 6 }, () => Math.round(Math.random() * 100));
};

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();


const addTicker = (color: string, symbol: string) => {
	chart.value!.data.datasets.push({
		label: `${symbol}-${color}`,
		data: generateRandomBars(),
		borderColor: color,
		borderWidth: 2,
		type: 'line',
		fill: true,
		pointStyle: false,
		backgroundColor: 'rgba(217, 217, 217, 0.1)',
		tension: 0.4,
		cubicInterpolationMode: 'monotone',
	});

	chart.value!.update();
};

const removeTicker = (idx: number) => {
	chart.value!.data.datasets.splice(idx, 1);

	chart.value!.update();
};

defineExpose({
	addTicker,
	removeTicker,
});

const chartAxisOptions = {
	y: {
		type: 'linear',
		position: 'right',
		display: true,

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

	x: {
		grid: {
			display: false,
		},
	},
};

const externalTooltipHandler = getExternalTooltipSplitted();

watchEffect(() => {
	if (props.hideAxis) {
		if (chart.value) {
			chart.value.options.scales = {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			};
			chart.value?.update();
		}

	} else {
		if (chart.value) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
			chart.value.options.scales = chartAxisOptions;
			chart.value?.update();
		}
	}
});

onMounted(() => {
	const labels = ['29 Jan 2013', '20 Mart 2017', '11 Apr 2021', '25 May 2021', '25 May 2025', '03 June 2025'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'dataset',
			},
			plugins: {
				legend: {
					display: false,
				},


				tooltip: {
					enabled: false,
					position: 'nearest',
					external: externalTooltipHandler,
				},
			},
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			scales: props.hideAxis ? {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			} : chartAxisOptions,
		},
	});
});


</script>

<template>
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>
	</div>
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
