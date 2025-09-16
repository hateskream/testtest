<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { RangeChart } from '@/shared/ui/chart-range';
import { getExternalTooltipVaults } from '../utils';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';
import ChartLegends from './chart-legends.vue';

const container = useTemplateRef('container');
const chart = ref<Chart>();
const currentRange = ref<RangeChart>(RangeChart['6M']);


const legendsList = [
	{
		color: '#fff',
		text: 'BTC Transaction Fee (I:BATF)',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

onMounted(() => {
	const labels = [
		'Mar 20, 2005', 'Mar 21, 2009', 'Mar 18, 2013', 'Mar 21, 2017',
		'Mar 19, 2021', 'Mar 21, 2025', 'Mar 22, 2025', 'Mar 23, 2025',
		'Mar 24, 2021', 'Mar 25, 2025', 'Mar 26, 2025', 'Mar 27, 2025',
	];

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
					borderWidth: 1,
					tension: 0.1,
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
					position: 'right',

					grid: {
						color: '#373737',
					},

					ticks: {
						color: 'rgba(154, 154, 157, 1)',
						maxTicksLimit: 8, // Показать максимум 6 меток по оси X
					},


					border: {
						dash: [2, 2],
					},
				},

				x: {

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
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>

		<chart-legends
			:list="legendsList"
		>
			<chart-range
				:list="[RangeChart['6M'], RangeChart['1Y']]"
				:active-range="currentRange"
				:disable-change="true"
				@select="currentRange = $event"
			/>
		</chart-legends>
	</div>
</template>

<style scoped>
.range {
	max-width: 100px;
}
</style>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 340px;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
