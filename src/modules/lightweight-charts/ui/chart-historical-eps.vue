<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { barDashedBorderPlugin } from '../plugins/bar-dashed-border';

const container = useTemplateRef('container');
const chart = ref<Chart>();

const generateRandomBars = () => {
	return Array.from({ length: 9 }, () => Math.round(Math.random() * 100));
};

onMounted(() => {
	const greyShades = [
		'rgba(255, 127, 53, 0.20)',
		'#EBEBEB',
	];
	const orangeShades = [
		'rgba(255, 127, 53, 0.20)',
		'rgba(255,255,255,0.1)',
	];
	const quarterData: { [x: string]: number[] } = {
		Q12024: generateRandomBars(),
		Q22024: generateRandomBars(),
	};
	const labels = ['2023 Q1', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'];
	const datasets = Object.keys(quarterData).map((q, idx) => ({
		label: q,
		data: quarterData[q],
		backgroundColor: labels.map((_, i) => i < 7 ? greyShades[idx] : orangeShades[idx]),
		borderColor: '#FF8D29',
		borderRadius: 10,
	}));

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets,
		},
		plugins: [
			barDashedBorderPlugin,
		],
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
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>


		<div :class="classes.legend">
			<div :class="classes.legendItem">
				<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
				<span>Forecast</span>
			</div>

			<div :class="classes.legendItem">
				<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
				<span>Reported</span>
			</div>
		</div>
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
	height: 350px !important;
}

.legend {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	padding: 17px 16px;
	border-top: 1px solid var(--border-color-base-300);
	gap: 31px;
}

.legendItem {
	display: flex;
	align-items: center;
	gap: 4px;
}

.legendItem span {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.legendCircle {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}

.legendCircleReport {
	background-color: #ff7f35;
}

.legendCircleEstimate {
	background-color: #ffffff;
}
</style>
