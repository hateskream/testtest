<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart, type TooltipModel } from 'chart.js/auto';


interface IChartProps {
	// width: number;
	height: number;
}

defineProps<IChartProps>();


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
				text.textContent = '$' + body.toString() + 'B';

			} else if (i === 1) {
				spanCircle.style.background = 'rgba(4, 237, 160, 1)';
				spanCircleText.textContent = 'D. Payment';
				text.textContent = body.toString() + '%';
			} else if (i === 2) {
				spanCircle.style.background = 'rgba(221, 246, 34, 1)';
				spanCircleText.textContent = 'Next Payment';
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

	const barData = [5, 10, 25, 35, 20, 45, 39, 15, 20, 40, 58, 58];

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
					yAxisID: 'y',
					tension: 0.1,
				},
				{
					type: 'bar',
					data: barData,

					backgroundColor:
						barData
							.map((_, idx) =>
								idx === barData.length - 1 ? 'rgba(255, 191, 0, 0.2)' : 'rgba(4, 237, 160, 0.1)',
							),
					borderColor:
						barData
							.map((_, idx) =>
								idx === barData.length - 1 ? 'rgba(221, 246, 34, 1)' : 'rgba(4, 237, 160, 1)',
							),
					borderWidth: {
						top: 2,
					},
					yAxisID: 'y1',
					barPercentage: 0.9,
					categoryPercentage: 1,
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
					position: 'left',
					beginAtZero: true,

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
					beginAtZero: true,

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
					offset: false,

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
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<canvas ref="container" :class="classes.mainChart"></canvas>

		<div :class="classes.instruments">
			<div :class="classes.legend">

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
					<span>D. Yield</span>
				</div>

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
					<span>D. Payment</span>
				</div>


				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleNextPayment]"></div>
					<span>Next Payment</span>
				</div>

			</div>
		</div>
	</div>
</template>

<style scoped>
.range {
	background-color: inherit;
}

.range:deep(.rangeItem) {
	max-width: 55px;
	color: #9a9a9d;
	background-color: inherit;
}

.range:deep(.rangeItemActive) {
	color: #ffffff;
}
</style>

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

.legendCircleEstimate {
	background-color: rgb(4 237 160 / 100%);
}

.legendCircleNextPayment {
	background-color: rgb(231 181 37 / 100%);
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
