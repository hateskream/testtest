import type { ArcElement, ChartDataset, ChartMeta, Plugin } from 'chart.js';

type PluginChartType = 'doughnut';

export type DoughnutFloatingLabelsPluginOptions = {
	datasets: number[];
	padding: number;
	font: string;
	color: string;
	backgroundColor: string;
	minAngle: number;
	label: (
		dataset: ChartDataset<PluginChartType, number[]>,
		dataIndex: number
	) => string;
};

export const doughnutFloatingLabelsPlugin: Plugin<PluginChartType, DoughnutFloatingLabelsPluginOptions> = {
	id: 'doughnutFloatingLabels',
	defaults: {
		datasets: [],
		padding: 7,
		font: '12px \'Roboto Flex Variable\', sans-serif',
		color: '#fff',
		backgroundColor: 'rgba(73, 73, 80, 0.4)',
		minAngle: 30,
		label: (dataset, dataIndex) => dataset.labels?.[dataIndex] ?? dataset.data[dataIndex].toString(),
	},
	afterDatasetsDraw(chart, _args, options) {
		const { ctx } = chart;

		const {
			datasets: allowed,
			padding,
			font,
			color,
			backgroundColor,
		} = options;

		const minAngle = (options.minAngle * Math.PI) / 180;

		chart.data.datasets.forEach((dataset, key) => {
			if (allowed.length && !allowed.includes(key)) {
				return;
			}

			const meta = chart.getDatasetMeta(key) as ChartMeta<PluginChartType, ArcElement>;

			meta.data.forEach((arc, index) => {
				const angleSize = arc.endAngle - arc.startAngle;

				if (angleSize < minAngle) {
					return;
				}

				const angle = (arc.startAngle + arc.endAngle) / 2;

				const x = arc.x + Math.cos(angle) * arc.outerRadius;
				const y = arc.y + Math.sin(angle) * arc.outerRadius;

				const label = options.label(dataset, index);

				ctx.save();
				ctx.font = font;

				const text = ctx.measureText(label);

				const boxWidth = text.width + padding * 2;
				const boxHeight = 24;

				ctx.beginPath();
				ctx.roundRect(
					x - boxWidth / 2,
					y - boxHeight / 2,
					boxWidth,
					boxHeight,
					6,
				);
				ctx.clip();

				ctx.filter = 'blur(2px)';
				ctx.fillStyle = backgroundColor;
				ctx.beginPath();
				ctx.roundRect(
					x - boxWidth / 2,
					y - boxHeight / 2,
					boxWidth,
					boxHeight,
					6,
				);
				ctx.fill();
				ctx.restore();

				ctx.fillStyle = color;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(label, x, y);
			});
		});
	},
};
