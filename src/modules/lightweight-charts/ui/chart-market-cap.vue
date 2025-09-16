<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { onMounted, shallowRef, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { RangeChart } from '@/shared/ui/chart-range';
import { getExternalTooltipSplitted } from '../utils';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';


interface IChartProps {
	height: CSSProperties['height'];
	isVisibleRange?: boolean;
	rangeList: RangeChart[];
}

withDefaults(defineProps<IChartProps>(), {
	isVisibleRange: true,
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

const externalTooltipHandler =getExternalTooltipSplitted();

onMounted(() => {
	const labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets:[],
		},
		options: {
			maintainAspectRatio: false,
			normalized: true,
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'dataset',
			},
			// onHover: (_, activeElements, chartC) => {
			// 	const { datasets } = chartC.config.data;

			// 	if (activeElements[0]) {
			// 		datasets.forEach(
			// 			(ds, idx) => {
			// 				if (idx !== activeElements[0].datasetIndex) {
			// 					const color = ds.label?.split('-')[1];

			// 					ds.borderColor = color?.replace(')', ', 0.1)');
			// 				}
			// 			},
			// 		);
			// 	} else {
			// 		datasets.forEach(
			// 			(ds ) => {
			// 				const color = ds.label?.split('-')[1];

			// 				ds.borderColor = color;
			// 			},
			// 		);
			// 	}

			// 	console.log(datasets);

			// 	chartC.update();
			// },
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

			scales: {
				y: {
					display: false,

					grid: {
						display: false,
					},

					border: {
						display: false,
					},
				},

				x: {
					ticks: {
						display: false,
					},

					grid: {
						display: false,
					},

					border: {
						display: false,
					},
				},

			},
		},
	});
});


</script>

<template>
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>

		<chart-range
			v-if="isVisibleRange"
			:class="classes.range"
			:active-range="RangeChart['ALL']"
			:list="rangeList"
		/>

	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	height: v-bind(height);
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}

.range {
	margin-top: 10px;
	margin-bottom: 10px;
}

</style>
