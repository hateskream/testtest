<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart, type TooltipModel } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

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


			if (i === 0) {
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

				spanCircle.style.background = 'rgba(221, 246, 34, 1)';
				spanCircleText.textContent = 'Data';

				text.textContent = '$' + body[0].toString();

				circle.appendChild(spanCircle);
				circle.appendChild(spanCircleText);

				contItem.appendChild(circle);
				contItem.appendChild(text);
				cont.appendChild(contItem);
			}
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
	const labels = ['Mar 17', 'Mar 24', 'Mar 25', 'Apr 14', 'Apr 28', 'May 12'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					data: [null, null, null, 10, null, null],
					pointStyle: 'circle',
					borderColor: '#000',
					pointBorderWidth: 2,
					backgroundColor: '#fff',
					borderWidth: 1,
				},
				{
					data: [null, null, null, 10, 10, 10],
					borderColor: '#FEB358',
					borderWidth: 1,
					pointStyle: false,
				},
				{
					data: [12, 12, 12, 12, 12, 12],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					pointStyle: false,
					backgroundColor: 'rgba(0,0,0,0.5)',
					fill: 'end',
				},

				{
					data: [9.5, 9.5, 9.5, 9.5, 9.5, 9.5],
					borderColor: '#D9D9D9',
					borderWidth: 1,
					borderDash: [3, 3],
					pointStyle: false,
					backgroundColor: 'rgba(0,0,0,0.5)',
					fill: 'start',
				},
				{
					data: [null, null, null, null, 14, null],
					pointStyle: 'circle',
					borderColor: '#000',
					pointBorderWidth: 2,
					backgroundColor: '#fff',
					borderWidth: 1,
				},
				{
					data: [null, null, null, null, 14, 14],
					borderColor: 'rgba(255, 255, 255, 0.8)',
					borderWidth: 1,
					pointStyle: false,
				},
				{
					data: [8, 10, 15, 10, 14, 12],
					borderColor: '#FEB358',
					borderWidth: 2,
					pointStyle: false,
					backgroundColor: 'rgba(254, 179, 88, 0.15)',
					fill: 'start',
					tension: 0.3,
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
				annotation:  {
					clip: false,
					annotations: {
						label1: {
							type: 'label',
							xValue: 5.2,
							yValue: 10,
							borderRadius: 24,
							color: '#FEB358',
							position: 'center',
							backgroundColor: 'rgba(136, 93, 36, 1)',
							content: ['Low'],
							padding: {
								top: 2,
								bottom: 2,
								left: 6,
								right: 6,
							},
							font: {
								size: 10,
							},
						},
						label2: {
							type: 'label',
							xValue: 5.2,
							yValue: 14,
							borderRadius: 24,
							color: '#fff',
							position: 'center',
							backgroundColor: '#4F4F4F',
							content: ['Neutral'],
							padding: {
								top: 2,
								bottom: 2,
								left: 6,
								right: 6,
							},
							font: {
								size: 10,
							},
						},
					},
				},
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
						padding: 20,
						autoSkip: true,
						font: {
							size: 10,
						},
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value;
						},
					},


					border: {
						dash: [2, 2],
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
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
