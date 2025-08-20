<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { generateQuartalLabels, generateRandomNumbers } from '../utils';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const container = useTemplateRef('container');
const chart = ref<Chart>();

const currentSlideIdx = ref<number>(0);
const slides = ref<{ data: number[]; quarterLabels: string[] }[]>([]);

const totalSlides = 2;
const totalShowYears = 2;
const totalShowQuartals = totalShowYears * 4;
const quarterLabels = generateQuartalLabels(totalSlides + totalShowYears);

const barsPerQuarter = 20;
const totalBarsPerTotalShowQuartals = barsPerQuarter * totalShowQuartals;
const totalBars = quarterLabels.length * barsPerQuarter;

const dataset = generateRandomNumbers(totalBars);

let tempStartSliceQuarter = 0;
let tempStartSliceData = 0;

for (let i =0; i < totalSlides; i += 1) {
	slides.value.push(
		{
			quarterLabels: quarterLabels.slice(tempStartSliceQuarter, tempStartSliceQuarter + totalShowQuartals),
			data: dataset.slice(tempStartSliceData, tempStartSliceData + totalBarsPerTotalShowQuartals),
		},
	);

	tempStartSliceQuarter += totalShowQuartals;
	tempStartSliceData += totalBarsPerTotalShowQuartals;
}


const labels = Array.from({ length: totalBarsPerTotalShowQuartals }, (_, i) => i + 1);


function nextSlide() {
	if ((slides.value.length - 1 < currentSlideIdx.value + 1) || !chart.value) {
		return;
	}

	currentSlideIdx.value += 1;

	chart.value.data.datasets.splice(0, 1);
	chart.value.data.datasets.push(prepareDataset(slides.value[currentSlideIdx.value].data));

	chart.value.update();
}

function prevSlide() {
	if ((currentSlideIdx.value - 1 < 0) || !chart.value) {
		return;
	}

	currentSlideIdx.value -= 1;

	chart.value.data.datasets.splice(0, 1);
	chart.value.data.datasets.push(prepareDataset(slides.value[currentSlideIdx.value].data));

	chart.value.render();
}

function prepareDataset(data: number[]) {
	return {
		data,
		backgroundColor: data.map((item) => item >= 0 ? '#04EDA0' : '#FC4A6B'),
	};
}


onMounted(() => {
	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets:[
				prepareDataset(slides.value[0].data),
			],
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

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				annotation: false,
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
					offset: true,
					ticks: {
						padding: 8,
						callback: function (_, index) {
							const step = barsPerQuarter;
							return index % step === 12
								? quarterLabels[Math.floor(index / step) ]
								: '';
						},
						maxRotation: 0,
						autoSkip: false,
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
		<div :class="classes.controls">
			<div :class="[classes.controlPrev, classes.control]" @click="prevSlide">
				<ui-icon :id="IconIds.Arrow" />
			</div>
			<div :class="[classes.controlNext, classes.control]" @click="nextSlide">
				<ui-icon :id="IconIds.Arrow" />
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
	height: 400px;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}

.controls {
	position: absolute;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.control {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	border: 1px solid rgb(166 166 166 / 30%);
	border-radius: 100%;
}

.controlNext {
	transform: rotateY(180deg);
}
</style>
