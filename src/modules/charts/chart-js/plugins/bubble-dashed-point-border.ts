import type { BubbleDataPoint, ChartDataset, Element, Plugin } from 'chart.js';

export interface IBubbleDatasetWithDash extends ChartDataset<'bubble', BubbleDataPoint[]> {
	pointBorderDash?: number[];
}

interface IBubbleElement extends Element<'bubble'> {
	skip?: boolean;
}

export const bubbleDashedPointBorderPlugin: Plugin<'bubble'> = {
	id: 'bubbleDashedPointBorder',
	afterDatasetDraw(chart, args) {
		const { ctx } = chart;
		const dataset = chart.data.datasets[args.index] as IBubbleDatasetWithDash;

		const dash = dataset.pointBorderDash;
		if (!dash || !dash.length) {
			return;
		}

		const meta = chart.getDatasetMeta(args.index);

		ctx.save();
		ctx.setLineDash(dash);

		meta.data.forEach(element => {
			if (!element) {
				return;
			}

			const point = element as IBubbleElement;
			if (point.skip) {
				return;
			}


			const { x, y, options } = point;
			const radius = options.radius ?? options.r ?? 3;

			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);

			ctx.lineWidth = options.borderWidth ?? 1;
			ctx.strokeStyle = options.borderColor || dataset.borderColor;

			ctx.stroke();
		});

		ctx.restore();
	},
};
