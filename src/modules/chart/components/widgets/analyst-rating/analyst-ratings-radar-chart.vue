<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

interface IAnalystRatingData {
	strongBuy: number;
	buy: number;
	neutral: number;
	sell: number;
	strongSell: number;
}

interface IAnalystRatingsRadarChartProps {
	data: IAnalystRatingData;
}

const props = defineProps<IAnalystRatingsRadarChartProps>();

const container = useTemplateRef('container');
const chart = ref<Chart>();

onMounted(() => {
	if (!container.value) {
		return;
	}

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'radar',
		data: {
			labels: ['Neutral', 'Buy', 'Strong Buy', 'Strong Sell', 'Sell'],
			datasets: [{
				data: [
					props.data.neutral,
					props.data.buy,
					props.data.strongBuy,
					props.data.strongSell,
					props.data.sell,
				],
				backgroundColor: 'rgba(4, 237, 160, 0.30)',
				borderColor: '#04EDA0',
				borderWidth: 1,
				pointBackgroundColor: '#04EDA0',
				pointBorderColor: '#fff',
				pointBorderWidth: 0,
			}],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				r: {
					beginAtZero: false,
					min: -2,
					max: 10,
					ticks: {
						display: false,
					},
					grid: {
						color: '#383838',
					},
					angleLines: {
						color: '#04EDA0',
						borderDash: [4, 8],
					},
					pointLabels: {
						color: '#9A9A9D',
						font: {
							size: 12,
						},
					},
				},
			},
		},
	});
});
</script>

<template>
	<div :class="classes.analystRatingsRadarChart">
		<canvas ref="container"></canvas>
	</div>
</template>

<style module="classes">
.analystRatingsRadarChart {
	width: 100%;
	height: 100%;
}
</style>
