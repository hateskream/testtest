<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { barDashedBorderPlugin } from '@/modules/lightweight-charts/plugins/bar-dashed-border';

const container = useTemplateRef('container');
const chart = ref<Chart>();

const generateRandomBars = () => {
	return Array.from({ length: 12 }, () => Math.round(Math.random() * 100));
};

onMounted(() => {
	const data = generateRandomBars();

	const labels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', '2025', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets: [
				{
					data,
					backgroundColor: 'rgba(255, 255, 255, 1)',
					borderColor: '#FFFFFF',
					borderRadius: 10,
					hoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
					hoverBorderColor: '#FFFFFF',

					barThickness: 20,
					maxBarThickness: 20,
				},
			],
		},
		plugins: [barDashedBorderPlugin],
		options: {
			maintainAspectRatio: false,
			normalized: true,
			responsive: true,
			plugins: {
				legend: { display: false },
				tooltip: { enabled: false },
			},
			scales: {
				y: {
					beginAtZero: true,
					position: 'right',
					grid: {
						display: true,
						color: '#373737',
						circular: true,
					},
					border: {
						dash: [2, 5],
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
	<canvas ref="container"  />
</template>
