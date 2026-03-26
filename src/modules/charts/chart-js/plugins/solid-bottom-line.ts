import { type Color, type Plugin } from 'chart.js';

export type SolidBottomLinePluginOptions = {
	color: Color;
	mode: 'area' | 'full';
};

export const solidBottomLinePlugin: Plugin<'line' | 'bar' | 'bubble', SolidBottomLinePluginOptions> = {
	id: 'solidBottomLine',
	defaults: {
		color: '#fff',
		mode: 'area',
	},
	beforeDatasetsDraw(chart, _args, options) {
		const { ctx, chartArea } = chart;

		if (!chartArea) {
			return;
		}

		const { color, mode } = options;
		const { left, right, bottom } = chartArea;

		ctx.save();

		ctx.lineWidth = 1;
		ctx.strokeStyle = color;

		ctx.beginPath();

		ctx.moveTo(mode === 'area' ? left : 0, bottom);
		ctx.lineTo(mode === 'area' ? right : chart.width, bottom);

		ctx.setLineDash([]);

		ctx.stroke();
		ctx.restore();
	},
};
