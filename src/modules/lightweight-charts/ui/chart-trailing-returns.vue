<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart, type TooltipModel } from 'chart.js/auto';

import { RangeChart } from '@/shared/ui/chart-range';

const container = useTemplateRef('container');
const chart = ref<Chart>();

const currentRange =ref<RangeChart>(RangeChart['YTD']);


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
		tooltipEl.style.width = '170px';
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
				spanCircle.style.background = 'rgba(221, 246, 34, 1)';
				spanCircleText.textContent = 'Revenue';

			} else if (i === 1) {
				spanCircle.style.background = 'rgba(4, 237, 160, 1)';
				spanCircleText.textContent = 'Profit margin';
			} else if (i === 2) {
				spanCircle.style.background = '#fefefe';
				spanCircleText.textContent = 'Net income';
			}

			text.textContent = '$' + body.toString() + 'B';

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


		<div :class="classes.instruments">
			<div :class="classes.legend">

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
					<span>DIA</span>
				</div>

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
					<span>SPY</span>
				</div>
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
	background-color: #ffffff;
}

.legendCircleEstimate {
	background-color: #ff7f35;
}

.instruments {
	display: flex;
	align-items: center;
	border-top: 1px solid var(--border-color-base-300);
}
</style>
