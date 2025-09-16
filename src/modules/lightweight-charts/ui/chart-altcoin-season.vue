<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js';

import { getExternalTooltipVaults } from '../utils';

const container = useTemplateRef('container');
const chart = ref<Chart>();


const legendsList = [
	{
		color: 'rgba(221, 246, 34, 1)',
		text: 'Data',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

onMounted(() => {
	const labels = ['Mar 17', 'Mar 24', 'Mar 25', 'Apr 14', 'Apr 28', 'May 12'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					data: [null, null, null, 10, null, null],
					pointStyle: 'circle',
					borderColor: '#000',
					pointBorderWidth: 2,
					backgroundColor: '#fff',
					borderWidth: 1,
				},
				{
					data: [null, null, null, 10, 10, 10],
					borderColor: '#FEB358',
					borderWidth: 1,
					pointStyle: false,
				},
				{
					data: [12, 12, 12, 12, 12, 12],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					pointStyle: false,
					backgroundColor: 'rgba(0,0,0,0.5)',
					fill: 'end',
				},

				{
					data: [9.5, 9.5, 9.5, 9.5, 9.5, 9.5],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					pointStyle: false,
					backgroundColor: 'rgba(0,0,0,0.5)',
					fill: 'start',
				},
				{
					data: [null, null, null, null, 14, null],
					pointStyle: 'circle',
					borderColor: '#000',
					pointBorderWidth: 2,
					backgroundColor: '#fff',
					borderWidth: 1,
				},
				{
					data: [null, null, null, null, 14, 14],
					borderColor: 'rgba(255, 255, 255, 0.8)',
					borderWidth: 1,
					pointStyle: false,
				},
				{
					data: [8, 10, 15, 10, 14, 12],
					borderColor: '#FEB358',
					borderWidth: 2,
					pointStyle: false,
					backgroundColor: 'rgba(254, 179, 88, 0.15)',
					fill: 'start',
					tension: 0.3,
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
				annotation:  {
					clip: false,
					annotations: {
						label1: {
							type: 'label',
							xValue: 5.2,
							yValue: 10,
							borderRadius: 24,
							color: '#FEB358',
							position: 'center',
							backgroundColor: 'rgba(136, 93, 36, 1)',
							content: ['Low'],
							padding: {
								top: 2,
								bottom: 2,
								left: 6,
								right: 6,
							},
							font: {
								size: 10,
							},
						},
						label2: {
							type: 'label',
							xValue: 5.2,
							yValue: 14,
							borderRadius: 24,
							color: '#fff',
							position: 'center',
							backgroundColor: '#4F4F4F',
							content: ['Neutral'],
							padding: {
								top: 2,
								bottom: 2,
								left: 6,
								right: 6,
							},
							font: {
								size: 10,
							},
						},
					},
				},
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
						padding: 20,
						autoSkip: true,
						font: {
							size: 10,
						},
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value;
						},
					},


					border: {
						dash: [2, 2],
					},
				},
				x: {
					ticks: {
						padding: 10,
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
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
