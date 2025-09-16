<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { getExternalTooltipVaults } from '../utils';

import ChartLegends from './chart-legends.vue';

const container = useTemplateRef('container');
const chart = ref<Chart>();
const legendsList = [
	{
		color: 'rgb(255 255 255 / 100%)',
		text: 'Actual Stats',
	},
	{
		color: '#ff7f35',
		text: 'Prediction',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

onMounted(() => {
	const labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bubble',
		data: {
			labels,
			datasets: [
				{
					type: 'bubble',
					data: [
						{
							x: 4,
							y: 50,
							r: 12,
						},

						{
							x: 8,
							y: 40,
							r: 12,
						},

						{
							x: 12,
							y: 50,
							r: 12,
						},

						{
							x: 16,
							y: 50,
							r: 12,
						},
					],
					borderColor: '#FFF',
					backgroundColor: '#FFF',
				},


				{
					type: 'bubble',
					data: [
						{
							x: 4,
							y: 35,
							r: 12,
						},

						{
							x: 12,
							y: 35,
							r: 12,
						},

						{
							x: 16,
							y: 35,
							r: 12,
						},

						{
							x: 18,
							y: 60,
							r: 12,
						},
					],

					borderColor: '#FF7F35',
					backgroundColor: '#FF7F351F',
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

				annotation: {
					clip: false,
					annotations: {
						label1: {
							type: 'label',
							content: () => 'beat',
							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 4,
							yValue: 65,
						},

						point1: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 4,
							yValue: 63,
						},

						label2: {
							type: 'label',
							content: () => 'beat',

							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 8,
							yValue: 65,
						},

						point2: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 8,
							yValue: 63,
						},

						label3: {
							type: 'label',
							content: () => 'beat',
							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 12,
							yValue: 65,
						},


						point3: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 12,
							yValue: 63,
						},

						label4: {
							type: 'label',
							content: () => 'beat',
							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 16,
							yValue: 65,
						},

						point4: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 16,
							yValue: 63,
						},
					},
				},
			},

			scales: {
				y1: {
					position: 'right',

					grid: {
						color: '#373737',
					},

					ticks: {
						padding: 20,
						count: 6,
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value;
						},
					},


					border: {
						dash: [2, 2],
					},
				},

				y: {
					position: 'left',

					grid: {
						color: '#373737',
					},

					ticks: {
						padding: 20,
						count: 6,
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return `${(+value * 13.8412).toFixed(2)}B`;
						},
					},


					border: {
						dash: [2, 2],
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
	<div :class="classes.wrapper">
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
	height: 350px;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
