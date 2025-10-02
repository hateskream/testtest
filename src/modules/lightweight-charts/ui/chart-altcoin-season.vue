<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js';

import { UiDriver } from '@/shared/ui/driver';
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
	const lines = [9.5, 12];

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
					data: [19.5, 19.5, 19.5, 19.5, 19.5, 19.5],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					pointStyle: false,
				},
				{
					data: [16.5, 16.5, 16.5, 16.5, 16.5, 16.5],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					backgroundColor: 'rgba(65, 59, 150, 0.2)',
					fill: 'end',
					pointStyle: false,
				},
				{
					data: [13.5, 13.5, 13.5, 13.5, 13.5, 13.5],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					pointStyle: false,
				},
				{
					data: [10.5, 10.5, 10.5, 10.5, 10.5, 10.5],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					pointStyle: false,
					backgroundColor: 'rgba(0,0,0,0.5)',
					fill: 'end',
				},
				{
					data: [8, 8, 8, 8, 8, 8],
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
					data: [8, 10, 20, 10, 14, 12],
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
			layout: {
				autoPadding: false,
			},
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
					display: false,
					type: 'linear',
					position: 'right',

					grid: {
						color: '#373737',
						display: false,
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
					display: false,
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
		<ui-driver />

		<span :class="classes.title">
			Chart
		</span>
		<div :class="classes.chartContainer">
			<canvas ref="container" :class="classes.mainChart"></canvas>
		</div>

		<ui-driver />
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.title {
	padding: 12px 16px;
	overflow: hidden;
	font-style: normal;
	font-weight: 440;
	font-size: 12px;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.08px;
	text-overflow: ellipsis;
}

.chartContainer {
	height: 175px;
	margin-bottom: 30px;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}
</style>
