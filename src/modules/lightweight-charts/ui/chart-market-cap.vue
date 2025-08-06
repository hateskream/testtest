<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { onMounted, shallowRef, useTemplateRef } from 'vue';
import { Chart, type TooltipModel } from 'chart.js/auto';

import { RangeChart } from '@/shared/ui/chart-range';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';


interface IChartProps {
	height: CSSProperties['height'];
	isVisibleRange?: boolean;
	rangeList: RangeChart[];
}

withDefaults(defineProps<IChartProps>(), {
	isVisibleRange: true,
});


const generateRandomBars = () => {
	return Array.from({ length: 6 }, () => Math.round(Math.random() * 100));
};

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();


const addTicker = (color: string, symbol: string) => {
	chart.value!.data.datasets.push({
		label: `${symbol}-${color}`,
		data: generateRandomBars(),
		borderColor: color,
		borderWidth: 2,
		pointStyle: false,
		backgroundColor: 'rgba(217, 217, 217, 0.1)',
		tension: 0.4,
		cubicInterpolationMode: 'monotone',
	});

	chart.value!.update();
};

const removeTicker = (idx: number) => {
	chart.value!.data.datasets.splice(idx, 1);

	chart.value!.update();
};

defineExpose({
	addTicker,
	removeTicker,
});

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


		bodyLines.forEach((body) => {
			const contItem = document.createElement('div');
			const circle = document.createElement('div');

			contItem.style.display = 'flex';
			contItem.style.alignItems = 'center';
			contItem.style.gap = '14px';
			contItem.style.justifyContent = 'space-between';

			const spanCircle = document.createElement('div');

			circle.style.display = 'flex';
			circle.style.alignItems = 'center';
			circle.style.gap = '4px';

			spanCircle.style.borderWidth = '2px';
			spanCircle.style.borderRadius = '20px';
			spanCircle.style.height = '10px';
			spanCircle.style.width = '10px';
			spanCircle.style.display = 'inline-block';

			const text = document.createElement('div');
			text.style.fontSize = '12px';

			const spanCircleText = document.createElement('span');
			spanCircleText.style.fontSize = '10px';

			const [ticker, value] = body.toString().split(':')!;
			const [symbol, color] = ticker.split('-')!;

			spanCircle.style.background = color;
			spanCircleText.textContent = symbol;

			text.textContent = '$' + value + 'B';

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
	const labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets:[],
		},
		options: {
			maintainAspectRatio: false,
			normalized: true,
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'dataset',
			},
			// onHover: (_, activeElements, chartC) => {
			// 	const { datasets } = chartC.config.data;

			// 	if (activeElements[0]) {
			// 		datasets.forEach(
			// 			(ds, idx) => {
			// 				if (idx !== activeElements[0].datasetIndex) {
			// 					const color = ds.label?.split('-')[1];

			// 					ds.borderColor = color?.replace(')', ', 0.1)');
			// 				}
			// 			},
			// 		);
			// 	} else {
			// 		datasets.forEach(
			// 			(ds ) => {
			// 				const color = ds.label?.split('-')[1];

			// 				ds.borderColor = color;
			// 			},
			// 		);
			// 	}

			// 	console.log(datasets);

			// 	chartC.update();
			// },
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
					display: false,

					grid: {
						display: false,
					},

					border: {
						display: false,
					},
				},

				x: {
					ticks: {
						display: false,
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

		<chart-range
			v-if="isVisibleRange"
			:class="classes.range"
			:active-range="RangeChart['ALL']"
			:list="rangeList"
		/>

	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	height: v-bind(height);
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}

.range {
	margin-top: 10px;
	margin-bottom: 10px;
}

</style>
