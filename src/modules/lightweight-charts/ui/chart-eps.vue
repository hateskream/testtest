<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart, type TooltipModel } from 'chart.js/auto';

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
				spanCircle.style.background = '#fff';
				spanCircleText.textContent = 'Actual';
			} else {
				spanCircle.style.background = '#ff7f35';
				spanCircleText.textContent = 'Prediction';
			}

			const [,txt] = body[0].split(',');

			text.textContent = '$' + txt.toString();

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
	const labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'bubble',
		data: {
			labels,
			datasets: [
				{
					type: 'bubble',
					data: [
						{
							x: 4,
							y: 50,
							r: 12,
						},

						{
							x: 8,
							y: 40,
							r: 12,
						},

						{
							x: 12,
							y: 50,
							r: 12,
						},

						{
							x: 16,
							y: 50,
							r: 12,
						},
					],
					borderColor: '#FFF',
					backgroundColor: '#FFF',
				},


				{
					type: 'bubble',
					data: [
						{
							x: 4,
							y: 35,
							r: 12,
						},

						{
							x: 12,
							y: 35,
							r: 12,
						},

						{
							x: 16,
							y: 35,
							r: 12,
						},

						{
							x: 18,
							y: 60,
							r: 12,
						},
					],

					borderColor: '#FF7F35',
					backgroundColor: '#FF7F351F',
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
					position: 'nearest',
					external: externalTooltipHandler,
				},

				annotation: {
					clip: false,
					annotations: {
						label1: {
							type: 'label',
							content: () => 'beat',
							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 4,
							yValue: 65,
						},

						point1: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 4,
							yValue: 63,
						},

						label2: {
							type: 'label',
							content: () => 'beat',

							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 8,
							yValue: 65,
						},

						point2: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 8,
							yValue: 63,
						},

						label3: {
							type: 'label',
							content: () => 'beat',
							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 12,
							yValue: 65,
						},


						point3: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 12,
							yValue: 63,
						},

						label4: {
							type: 'label',
							content: () => 'beat',
							font: {
								size: 14,
							},
							color: '#04EDA0',
							xValue: 16,
							yValue: 65,
						},

						point4: {
							type: 'point',
							backgroundColor: '#04EDA0',
							borderColor: '#04EDA0',
							borderWidth: 1,
							pointStyle: 'triangle',
							rotation: 180,
							radius: 5,
							xValue: 16,
							yValue: 63,
						},
					},
				},
			},

			scales: {
				y1: {
					position: 'right',

					grid: {
						color: '#373737',
					},

					ticks: {
						padding: 20,
						count: 6,
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value;
						},
					},


					border: {
						dash: [2, 2],
					},
				},

				y: {
					position: 'left',

					grid: {
						color: '#373737',
					},

					ticks: {
						padding: 20,
						count: 6,
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return `${(+value * 13.8412).toFixed(2)}B`;
						},
					},


					border: {
						dash: [2, 2],
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
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>

		<div :class="classes.instruments">
			<div :class="classes.legend">

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
					<span>Actual Stats</span>
				</div>

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
					<span>Prediction</span>
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
	height: 350px;
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
