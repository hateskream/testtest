<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { getExternalTooltipVaults } from '../utils';

import CharLegends from './chart-legends.vue';

const container = useTemplateRef('container');
const chart = ref<Chart>();

const legendsList = [
	{
		color: '#04eda0',
		text: 'Profit Margin',
	},
	{
		color: '#ddf622',
		text: 'Gross',
	},
	{
		color: 'rgb(255 255 255 / 100%)',
		text: 'Operating',
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
					type: 'line',
					borderColor: '#DDF622',
					data: [42, 47, 35, 35, 60, 50],
					pointStyle: false,
					tension: 0.1,
				},
				{
					type: 'line',
					borderColor: '#FFF',
					data: [10, 15, 25, 15, 25, 34],
					pointStyle: false,
					tension: 0.1,
				},
				{
					type: 'line',
					borderColor: '#04EDA0',
					data: [1, 4, 7, 4, 10, 16],
					pointStyle: false,
					tension: 0.1,
					borderDash: [2, 2],
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
					position: 'right',

					grid: {
						color: '#373737',
					},

					ticks: {
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + '%';
						},
					},


					border: {
						dash: [2, 2],
					},
				},

				x: {
					display: false,

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

		<char-legends
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
	height: 400px;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
