<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart, type TooltipModel } from 'chart.js/auto';

import { RangeChart } from '@/shared/ui/chart-range';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';

const container = useTemplateRef('container');
const chart = ref<Chart>();
const currentRange = ref<RangeChart>(RangeChart['6M']);

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
			spanCircle.style.marginRight = '8px';
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
				spanCircleText.textContent = 'BTC Transaction Fee';
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

onMounted(() => {
	const labels = [
		'Mar 20, 2005', 'Mar 21, 2009', 'Mar 18, 2013', 'Mar 21, 2017',
		'Mar 19, 2021', 'Mar 21, 2025', 'Mar 22, 2025', 'Mar 23, 2025',
		'Mar 24, 2021', 'Mar 25, 2025', 'Mar 26, 2025', 'Mar 27, 2025',
	];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bar',
		data: {
			labels,
			datasets: [
				{
					type: 'line',
					borderColor: 'rgba(255, 255, 255, 1)',
					data: [40, 50, 69, 70, 75, 65, 50, 65, 65, 80, 96, 50, 86],
					pointStyle: false,
					borderWidth: 1,
					tension: 0.1,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
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
					position: 'nearest',
					external: externalTooltipHandler,
				},
			},

			scales: {
				y: {
					type: 'linear',
					display: true,
					position: 'right',

					grid: {
						color: '#373737',
					},

					ticks: {
						color: 'rgba(154, 154, 157, 1)',
						maxTicksLimit: 8, // Показать максимум 6 меток по оси X
					},


					border: {
						dash: [2, 2],
					},
				},

				x: {

					ticks: {
						padding: 20,
						autoSkip: true,
						maxTicksLimit: 6, // Показать максимум 6 меток по оси X
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

		<div :class="classes.instruments">
			<chart-range
				:list="[RangeChart['6M'], RangeChart['1Y']]"
				:active-range="currentRange"
				:disable-change="true"
				@select="currentRange = $event"
			/>

			<div :class="classes.legend">
				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
					<span>BTC Transaction Fee (I:BATF)</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.range {
	max-width: 100px;
}
</style>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 340px;
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
	background-color: rgb(255 255 255 / 100%);
}


.instruments {
	display: flex;
	align-items: center;
	border-top: 1px solid var(--border-color-base-300);
}
</style>
