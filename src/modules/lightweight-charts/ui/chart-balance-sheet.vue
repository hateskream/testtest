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
		color: 'rgb(4 237 160 / 100%)',
		text: 'Total Assets',
	},
	{
		color: 'rgb(231 181 37 / 100%)',
		text: 'Total Liabilities',
	},
	{
		color: 'rgb(255 255 255 / 100%)',
		text: 'Debt to Assets',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

onMounted(() => {
	const labels = ['2019', '2020', '2021', '2022', '2023', '2024'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets: [
				{
					type: 'bar',
					data: [8, 10, 4, 8, 10, 8],

					backgroundColor: 'rgba(4, 237, 160, 0.1)',
					borderColor: 'rgba(4, 237, 160, 1)',
					borderWidth: {
						top: 2,
					},
				},
				{
					type: 'bar',
					data: [12, 8, 5, 5, 7, 8],
					backgroundColor: 'rgba(255, 191, 0, 0.2)',
					borderColor: 'rgba(221, 246, 34, 1)',
					borderWidth: {
						top: 2,
					},
				},
				{
					type: 'line',
					borderColor: 'rgba(255, 255, 255, 1)',
					data: [42, 47, 20, 35, 60, 50],
					pointStyle: false,
					tension: 0.1,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			normalized: true,
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
					ticks: {
						padding: 20,
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
