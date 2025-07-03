<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

interface IChartProps {
	// width: number;
	height: number;
}

defineProps<IChartProps>();


const container = useTemplateRef('container');
const chart = ref<Chart>();

onMounted(() => {
	const labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					data: [8, 10, 15, 10, 14, 12],
					stepped: true,
					borderColor: 'rgba(221, 246, 34, 1)',
					borderWidth: 2,
					pointStyle: false,
					backgroundColor: 'rgba(217, 217, 217, 0.1)',
					fill: 'start',
				},

				{
					data: [6, 7, 5, 6, 8, 6],
					stepped: true,
					borderColor: 'rgba(4, 237, 160, 1)',
					borderDash: [6, 6],
					borderWidth: 2,
					pointStyle: false,
				},


				{
					data: [1, 3, 3, 4, 4, 2],
					stepped: true,
					borderColor: '#fefefe',
					borderWidth: 2,
					pointStyle: false,
					backgroundColor: 'rgba(217, 217, 217, 0.1)',
					fill: 'start',
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
				},
			},

			scales: {
				y: {
					type: 'linear',
					display: true,
					position: 'left',

					grid: {
						color: '#373737',
					},

					ticks: {
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + 'B';
						},
					},


					border: {
						dash: [2, 2],
					},
				},
				y1: {
					type: 'linear',
					display: true,
					position: 'right',

					min: 0,
					max: 100,


					ticks: {
						maxTicksLimit: 6,
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + '%';
						},
					},

					// grid line settings
					grid: {
						drawOnChartArea: false, // only want the grid lines for one axis to show up
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
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<canvas ref="container" :class="classes.mainChart"></canvas>

		<div :class="classes.instruments">
			<div :class="classes.legend">

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
					<span>Revenue</span>
				</div>

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
					<span>Profit Margin</span>
				</div>

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleNet]"></div>
					<span>Net Income</span>
				</div>

			</div>
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}

.legend {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	padding: 20px 16px;
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
	background-color: rgb(221 246 34 / 100%);
}

.legendCircleEstimate {
	background-color: rgb(4 237 160 / 100%);
}

.legendCircleNet {
	background-color: rgb(255 255 255 / 100%);
}

.instruments {
	display: flex;
	align-items: center;
	border-top: 1px solid var(--border-color-base-300);
}

.range {
	max-width: 92px;
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>
