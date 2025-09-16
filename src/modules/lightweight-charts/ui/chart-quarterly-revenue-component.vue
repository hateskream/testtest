<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import ChartLegends from './chart-legends.vue';

interface IChartProps {
	// width: number;
	height: number;
}

defineProps<IChartProps>();

const container = useTemplateRef('container');
const chart = ref<Chart>();

const generateRandomBars = () => {
	return Array.from({ length: 6 }, () => Math.round(Math.random() * 100));
};

onMounted(() => {
	const greyShades = [
		'#EBEBEB',
		'#B4B4B7',
		'#8C8C8F',
		'#505053',
	];
	const orangeShades = [
		'#FF7F35',
		'#D7570D',
		'#B93900',
		'#870700',
	];
	const quarterData: { [x: string]: number[] } = {
		Q1: generateRandomBars(),
		Q2: generateRandomBars(),
		Q3: generateRandomBars(),
		Q4: generateRandomBars(),
	};
	const labels = ['2021', '2022', '2023', '2024', '2025', '2026'];
	const datasets = Object.keys(quarterData).map((q, idx) => ({
		label: q,
		data: quarterData[q],
		// для каждого элемента массива: первые 4 — серый оттенок, последние 2 — оранжевый
		backgroundColor: labels.map((_, i) => i < 4 ? greyShades[idx] : orangeShades[idx]),
		borderWidth: 0,
		borderRadius: 5,
	}));

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets,
		},
		options: {
			maintainAspectRatio: false,
			normalized: true,
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},

				tooltip: {
					enabled: false,
				},

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
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<canvas ref="container" :class="classes.mainChart"></canvas>

		<chart-legends
			:list="[
				{
					color: '#d9d9d9',
					text: 'Reported'
				},
				{
					color: '#ff7f35',
					text: 'Estimate'
				},
			]"
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
