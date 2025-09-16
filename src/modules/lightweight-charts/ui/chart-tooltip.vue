<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js';
import { type PartialEventContext } from 'chartjs-plugin-annotation';

import type { IChartTooltipData } from '../model';
import type { RangeChart } from '@/shared/ui/chart-range';
import { getExternalTooltipVaults } from '../utils';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';


interface IChartProps {
	rangeList: RangeChart[];
	data: IChartTooltipData[];
	badge?: {
		color: string;
		text: string;
	};
}

const props = defineProps<IChartProps>();

const activeRange = defineModel<RangeChart>('activeRange', {
	required: true,
});

const container = useTemplateRef('container');
const chart = ref<Chart>();

const legendsList = [
	{
		color: 'rgba(255, 255, 255, 1)',
		text: 'D. Yield',
	},
];

const externalTooltipHandler = getExternalTooltipVaults(legendsList);

function average(ctx: PartialEventContext) {
	const values = ctx.chart.data.datasets[0].data;
	// @ts-expect-error no catch with non num
	return values.reduce((a, b) => Number(a) + Number(b), 0) / values.length;
}

onMounted(() => {
	const labels = props.data.map((item) => item.date.toDateString());

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					borderWidth: 1,
					borderColor: 'rgba(255, 255, 255, 1)',
					data: props.data.map(item => item.value),
					pointStyle: false,
					tension: 0.1,
				},
			],
		},
		options: {
			responsive: true,

			interaction: {
				mode: 'index',
				intersect: false,
			},
			plugins: {
				legend: {
					display: false,
				},
				annotation: {
					clip: false,
					annotations: {
						annotation: {
							type: 'line',
							borderColor: '#6D00FC',
							borderDash: [6, 6],
							borderDashOffset: 0,
							borderWidth: 1,

							label: {
								color: '#6D00FC',
								display: true,
								backgroundColor: 'rgb(12 12 13 / 100%)',

								content: (ctx) => `${average(ctx).toFixed(2)}%`,
								position: 'end',

							},
							scaleID: 'y',
							value: (ctx) => average(ctx),
						},
					},
				},
				tooltip: {
					enabled: false,
					position: 'nearest',
					external: externalTooltipHandler,
				},
			},

			scales: {
				y: {
					display: false,

					grid: {
						display: false,
					},

					border: {
						display: false,
					},
				},
				x: {
					display: false,

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
		<div :class="classes.chartTitle">
			<div :class="classes.chartTitleText">
				<slot name="title" />
			</div>

			<div
				v-if="badge"
				:class="classes.chartTitleBadge"
				:style="{backgroundColor: badge.color}"
			>
				{{ badge.text }}
			</div>
		</div>

		<canvas ref="container" :class="classes.mainChart"></canvas>

		<chart-range
			:list="rangeList"
			type="light"
			:active-range="activeRange"
			@select="activeRange = $event"
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

.chartTitle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
}

.chartTitleText {
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
}

.chartTitleBadge {
	width: max-content;
	padding: 2px 6px;
	font-weight: 440;
	font-size: 10px;
	color: #ffffff;
	border-radius: 4px;
}
</style>
