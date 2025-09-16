<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import { RangeChart } from '@/shared/ui/chart-range';
import { getExternalTooltipVaults } from '../utils';

import ChartLegends from './chart-legends.vue';

const container = useTemplateRef('container');
const chart = ref<Chart>();

const currentRange =ref<RangeChart>(RangeChart['YTD']);

const legendsList = [
	{
		color: '#fff',
		text: 'DIA',
	},
	{
		color: '#ff7f35',
		text: 'SPY',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

const genNum = () => {
	return Math.floor(Math.random() * (20 - 10) - 10);
};


onMounted(() => {
	const data = Array.from({ length: 40 }, () => genNum());


	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels: data,
			datasets: [
				{
					type: 'line',
					borderColor: 'rgba(255, 255, 255, 1)',
					data: data,
					pointStyle: false,
					tension: 0.1,
				},

				{
					type: 'line',
					borderColor: '#FF7F35',
					data: data.map((item) => item > 0 ? item + 4 : item - 4 ),
					pointStyle: false,
					tension: 0.1,
					borderDash: [2, 2],
				},
			],
		},
		options: {
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false,
					position: 'average',
					external: externalTooltipHandler,
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

					ticks: {
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + '%';
						},
					},

					border: {
						dash: [2, 5],
					},
				},

				x: {
					display: false,
				},
			},
		},
	});
});


</script>

<template>
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>


		<div :class="classes.range">
			<div :class="[classes.rangeItem, classes.rangeItemRef]">
				Reference
			</div>

			<div
				v-for="item in [
					RangeChart['YTD'],
					RangeChart['1M'],
					RangeChart['3M'],
					RangeChart['1Y'],
					RangeChart['3Y']
				]"
				:key="'range' + item"
				:class="[
					classes.rangeItem,
					classes.rangeItemSelector,
					{
						[classes.rangeItemSelected]: currentRange === item
					}
				]"

				@click="currentRange = item"
			>
				{{ item }}
			</div>

			<div
				:class="[classes.rangeItem, classes.rangeItemDia]"
			>
				DIA
			</div>

			<div
				v-for="item in [
					-0.67,
					-2.69,
					-2.24,
					7.17,
					21.83
				]"
				:key="'dia' + item"
				:class="[classes.rangeItem, classes.rangeSubItemDia]"
			>
				{{ item }}%
			</div>


			<div
				:class="[classes.rangeItem, classes.rangeItemSpy]"
			>
				SPY
			</div>

			<div
				v-for="item in [
					-2.78,
					-4.59,
					-5.24,
					9.32,
					26.48
				]"
				:key="'spy' + item"
				:class="[classes.rangeItem, classes.rangeSubItemSpy]"
			>
				{{ item }}%
			</div>
		</div>


		<chart-legends
			:list="[
				{
					color: '#fff',
					text: 'DIA'
				},
				{
					color: '#ff7f35',
					text: 'SPY'
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
	height: 100% !important;
}


.range {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	margin-top: 20px;
}

.rangeItem {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 50px;
	font-size: 10px;
	border-top: 1px solid rgb(97 97 97 / 30%);
	opacity: 0.65;
}

.rangeSubItemSpy {
	font-weight: 440;
	color: var(--text-color-attention-500);
	letter-spacing: 0.08px;
}

.rangeSubItemDia {
	font-weight: 440;
	color: var(--text-color-base-500);
	letter-spacing: 0.08px;
}

.rangeItemSelector {
	font-weight: 440;
	color: var(--text-color-base-100);
	letter-spacing: 0.08px;
	cursor: pointer;
}

.rangeItemSelected {
	font-weight: 700;
	font-size: 13px;
	color: var(--text-color-active-base-300-active);
	letter-spacing: 0.052px;
	background: var(--bg-color-base-300-activated);
	border-radius: 8px;
}

.rangeItemRef {
	font-weight: 440;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
	opacity: 1;
}

.rangeItemDia {
	font-weight: 700;
	color: var(--text-color-base-500);
	letter-spacing: 0.08px;
	opacity: 1;
}

.rangeItemSpy {
	font-weight: 700;
	color: var(--text-color-attention-500);
	letter-spacing: 0.08px;
	opacity: 1;
}
</style>
