<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

interface IChartProps {
	width: number;
	height: number;
}

defineProps<IChartProps>();

const container = useTemplateRef('container');
const chart = ref<Chart>();

const colors = [
	'#EBEBEB',
	'#B4B4B7',
	'#8C8C8F',
	'#505053',
	'#FF7F35',
	'#D7570D',
	'#B93900',
	'#870700',
];


const generateRandomBars = () => {
	return Array.from({ length: 4 }, () => Math.round(Math.random() * 100));
};

onMounted(() => {
	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels: ['2022', '2023', '2024', '2025', '2026'],
			datasets: Array.from({ length: 4 }, (_, idx) => ({
				label: '',
				data: generateRandomBars(),
				backgroundColor: colors.map(() => colors[idx]),
				borderRadius: 5,
				offset: true,
				order: 12,

			})),
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
	height: 100%;
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>
