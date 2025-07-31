<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue';
import { Chart, type TooltipModel } from 'chart.js/auto';


interface IChartProps {
	height: CSSProperties['height'];
	hideAxis?: boolean;
}

const props = withDefaults(defineProps<IChartProps>(), {
	hideAxis: false,
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
		type: 'line',
		fill: true,
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

const chartAxisOptions = {
	y: {
		type: 'linear',
		position: 'right',
		display: true,

		min: 0,
		max: 100,

		ticks: {
			maxTicksLimit: 6,
			color: 'rgba(154, 154, 157, 1)',
			callback: function (value: string) {
				return value + '%';
			},
		},

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
		ticks: {
			padding: 20,
		},

		grid: {
			display: false,
		},
	},
};

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

watchEffect(() => {
	if (props.hideAxis) {
		if (chart.value) {
			chart.value.options.scales = {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			};
			chart.value?.update();
		}

	} else {
		if (chart.value) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
			chart.value.options.scales = chartAxisOptions;
			chart.value?.update();
		}
	}
});

onMounted(() => {
	const labels = ['29 Jan 2013', '20 Mart 2017', '11 Apr 2021', '25 May 2021', '25 May 2025', '03 June 2025'];

	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels,
			datasets: [],
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'dataset',
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
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			scales: props.hideAxis ? {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			} : chartAxisOptions,
		},
	});
});


</script>

<template>
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<canvas ref="container" :class="classes.mainChart"></canvas>
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	width: 100%;
	height: v-bind(height);
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}
</style>
