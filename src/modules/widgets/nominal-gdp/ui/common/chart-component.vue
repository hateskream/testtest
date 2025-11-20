<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { barDashedBorderPlugin } from '@/modules/lightweight-charts/plugins/bar-dashed-border';

const container = useTemplateRef('container');
const chart = ref<Chart>();

onMounted(() => {
	const greyShades = [
		'rgba(255, 127, 53, 0.20)',
		'#EBEBEB',
	];
	const orangeShades = [
		'rgba(255, 127, 53, 0.20)',
		'rgba(255,255,255,0.1)',
	];

	const labels = [
		'2018', '2019', '2020', '2021', '2022',
		'2023', '2024', '2025', '2026', '2027',
	];

	const greyBars = [0.4, 0.7, 1.1, 0.8, 1.6, 1.3, 1.6, 1.8, 0, 0];

	const orangeBars = [1.8, 1.9, 2.0, 2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.3];

	const quarterData: { [x: string]: number[] } = {
		Q12024: greyBars,
		Q22024: orangeBars,
	};

	const datasets = Object.keys(quarterData).map((q, idx) => ({
		label: q,
		data: quarterData[q],
		backgroundColor: labels.map((_, i) =>
			idx === 0
				? i < 8 ? greyShades[1] : 'transparent' // серые до 2025 включительно
				: orangeShades[0], // оранжевые всегда
		),
		borderColor: idx === 0 ? '#EBEBEB' : '#FF8D29',
		borderRadius: 5,
		hoverBackgroundColor: labels.map((_, i) =>
			idx === 0
				? i < 8 ? greyShades[1] : 'transparent'
				: orangeShades[0],
		),
		hoverBorderColor: idx === 0 ? '#EBEBEB' : '#FF8D29',

		maxBarThickness: 15,
		barPercentage: 1,
		categoryPercentage: 0.7,
	}));

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets,
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
					border: { dash: [2, 5] },
				},
				x: {
					ticks: { padding: 10 },
					grid: { display: false },
					border: { display: false },
				},
			},
		},
	});
});
</script>

<template>
	<canvas ref="container" />
</template>
