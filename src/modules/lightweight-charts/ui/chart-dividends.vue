<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { getExternalTooltipVaults } from '../utils';

import ChartLegends from './chart-legends.vue';


interface IChartProps {
	// width: number;
	height: number;
}

defineProps<IChartProps>();


const container = useTemplateRef('container');
const chart = ref<Chart>();

const legendsList = [
	{
		color: 'rgb(255 255 255 / 100%)',
		text: 'D. Yield',
	},
	{
		color: 'rgb(4 237 160 / 100%)',
		text: 'D. Payment',
	},
	{
		color: 'rgb(231 181 37 / 100%)',
		text: 'Next Payment',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);


onMounted(() => {
	const labels = [
		'Mar 20, 2005', 'Mar 21, 2009', 'Mar 18, 2013', 'Mar 21, 2017',
		'Mar 19, 2021', 'Mar 21, 2025', 'Mar 22, 2025', 'Mar 23, 2025',
		'Mar 24, 2021', 'Mar 25, 2025', 'Mar 26, 2025', 'Mar 27, 2025',
	];

	const barData = [5, 10, 25, 35, 20, 45, 39, 15, 20, 40, 58, 58];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets: [
				{
					type: 'line',
					borderColor: 'rgba(255, 255, 255, 1)',
					data: [40, 50, 69, 70, 75, 65, 50, 65, 65, 80, 96, 50, 86],
					pointStyle: false,
					yAxisID: 'y',
					tension: 0.1,
				},
				{
					type: 'bar',
					data: barData,

					backgroundColor:
						barData
							.map((_, idx) =>
								idx === barData.length - 1 ? 'rgba(255, 191, 0, 0.2)' : 'rgba(4, 237, 160, 0.1)',
							),
					borderColor:
						barData
							.map((_, idx) =>
								idx === barData.length - 1 ? 'rgba(221, 246, 34, 1)' : 'rgba(4, 237, 160, 1)',
							),
					borderWidth: {
						top: 2,
					},
					yAxisID: 'y1',
					barPercentage: 0.9,
					categoryPercentage: 1,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,

			interaction: {
				mode: 'index',
				intersect: false,
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

			scales: {
				y: {
					type: 'linear',
					display: true,
					position: 'left',
					beginAtZero: true,

					grid: {
						color: '#373737',
					},

					ticks: {
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + 'B';
						},
					},


					border: {
						dash: [2, 2],
					},
				},
				y1: {
					type: 'linear',
					display: true,
					position: 'right',
					beginAtZero: true,

					min: 0,
					max: 100,


					ticks: {
						maxTicksLimit: 6,
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + '%';
						},
					},

					// grid line settings
					grid: {
						drawOnChartArea: false, // only want the grid lines for one axis to show up
					},
				},

				x: {
					offset: false,

					ticks: {
						padding: 20,
						autoSkip: true,
						maxTicksLimit: 6, // Показать максимум 6 меток по оси X
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
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<canvas ref="container" :class="classes.mainChart"></canvas>

		<chart-legends
			:list="legendsList"
		/>
	</div>
</template>

<style scoped>
.range {
	background-color: inherit;
}

.range:deep(.rangeItem) {
	max-width: 55px;
	color: #9a9a9d;
	background-color: inherit;
}

.range:deep(.rangeItemActive) {
	color: #ffffff;
}
</style>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
