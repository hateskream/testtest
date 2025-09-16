<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js';

import { getExternalTooltipVaults } from '../utils';

const container = useTemplateRef('container');
const chart = ref<Chart>();


const legendsList = [
	{
		color: '#fff',
		text: 'Avg Fee',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

const data = [0, 15, 32, 39, 40, 50, 40, 32, 15, 35, 59, 30, 45, 67, 43, 21, 50, 45, 34, 54, 76];

onMounted(() => {
	const labels = data;

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					data: data,
					borderColor: '#FFF',
					tension: 0.4,
					borderWidth: 1,
					pointStyle: false,
					backgroundColor: 'rgba(255,255,255,0.1)',
					fill: 'start',
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
					display: false,

					grid: {
						display: false,
					},

					border: {
						display: false,
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
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100px;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
