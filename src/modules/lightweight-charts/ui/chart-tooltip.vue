<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart, type TooltipModel } from 'chart.js';
import { type PartialEventContext } from 'chartjs-plugin-annotation';

import type { IChartTooltipData } from '../model';
import type { RangeChart } from '@/shared/ui/chart-range';

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

const getOrCreateTooltip = (ct: Chart): HTMLDivElement => {
	let tooltipEl = ct.canvas.parentNode!.querySelector('.chartjs-income-statement-tooltip') as HTMLDivElement;

	if (!tooltipEl) {
		tooltipEl = document.createElement('div');
		tooltipEl.classList.add('chartjs-income-statement-tooltip');
		tooltipEl.style.background = 'rgba(22, 22, 24, 1)';
		tooltipEl.style.borderRadius = '12px';
		tooltipEl.style.border = '12px';
		tooltipEl.style.borderWidth = '1px';
		tooltipEl.style.borderStyle = 'solid';
		tooltipEl.style.borderColor = 'rgba(199, 199, 199, 0.1)';
		tooltipEl.style.width = '190px';
		tooltipEl.style.color = 'white';
		tooltipEl.style.opacity = '1';
		tooltipEl.style.pointerEvents = 'none';
		tooltipEl.style.position = 'absolute';
		tooltipEl.style.transform = 'translate(-50%, 0)';
		tooltipEl.style.transition = 'all .1s ease';

		const table = document.createElement('article');
		table.style.margin = '0px';

		tooltipEl.appendChild(table);
		ct.canvas.parentNode!.appendChild(tooltipEl);
	}

	return tooltipEl as HTMLDivElement;
};

const externalTooltipHandler = (context: {
	chart: Chart;
	tooltip: TooltipModel<'line'>;
}) => {
	const tooltipEl = getOrCreateTooltip(context.chart);

	// Hide if no tooltip
	if (context.tooltip.opacity === 0) {
		tooltipEl.style.opacity = '0';
		return;
	}

	// Set Text
	if (context.tooltip.body) {
		const titleLines = context.tooltip.title || [];
		const bodyLines = context.tooltip.body.map(b => b.lines);

		const cont = document.createElement('article');

		cont.style.display = 'flex';
		cont.style.flexDirection = 'column';
		cont.style.gap = '6px';
		cont.style.padding = '8px';


		bodyLines.forEach((body, i) => {
			const contItem = document.createElement('div');
			const circle = document.createElement('div');

			contItem.style.display = 'flex';
			contItem.style.alignItems = 'center';
			contItem.style.gap = '26px';
			contItem.style.justifyContent = 'space-between';

			const spanCircle = document.createElement('div');

			spanCircle.style.borderWidth = '2px';
			spanCircle.style.marginRight = '10px';
			spanCircle.style.borderRadius = '20px';
			spanCircle.style.height = '10px';
			spanCircle.style.width = '10px';
			spanCircle.style.display = 'inline-block';

			const text = document.createElement('div');
			text.style.fontSize = '12px';

			const spanCircleText = document.createElement('span');
			spanCircleText.style.fontSize = '10px';

			if (i === 0) {
				spanCircle.style.background = 'rgba(255, 255, 255, 1)';
				spanCircleText.textContent = 'D. Yield';
				text.textContent = '$' + body.toString();

			}


			circle.appendChild(spanCircle);
			circle.appendChild(spanCircleText);

			contItem.appendChild(circle);
			contItem.appendChild(text);
			cont.appendChild(contItem);
		});


		titleLines.forEach(title => {
			const contItem = document.createElement('div');
			const text = document.createTextNode(title);

			contItem.style.fontSize = '10px';
			contItem.style.color = 'rgba(154, 154, 157, 1)';

			contItem.appendChild(text);
			cont.appendChild(contItem);
		});

		const root = tooltipEl.querySelector('article');

		// Remove old children
		while (root!.firstChild) {
			root!.firstChild.remove();
		}

		root!.appendChild(cont);
	}

	const { offsetLeft: positionX, offsetTop: positionY } = context.chart!.canvas;

	// Display, position, and set styles for font
	tooltipEl.style.opacity = '1';
	tooltipEl.style.left = positionX + context.tooltip.caretX + 'px';
	tooltipEl.style.top = positionY + context.tooltip.caretY + 'px';
	tooltipEl.style.padding = context.tooltip.options.padding + 'px ' + context.tooltip.options.padding + 'px';
};

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
