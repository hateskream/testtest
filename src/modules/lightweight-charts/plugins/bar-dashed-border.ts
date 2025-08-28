import type { Chart, ChartMeta } from 'chart.js';

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	const r = Math.min(radius, width / 2, height / 2);

	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + width - r, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + r);
	ctx.lineTo(x + width, y + height - r);
	ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
	ctx.lineTo(x + r, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}

export const barDashedBorderPlugin = {
	id: 'DashedBorder',
	afterDatasetDraw(chart: Chart<'bar'>, args: { index: number; meta: ChartMeta<'bar'> }) {
		args.meta.data.forEach(function (element) {
			const { ctx } = chart;

			// @ts-expect-error non-error, cause empty object provides by default
			const half = element.width / 2;
			const left = element.x - half;
			const right = element.x + half;
			const top = element.y;
			const width = right - left;

			// @ts-expect-error non-error, cause empty object provides by default
			const { height } = element;

			ctx.beginPath();
			ctx.lineWidth = element.options.borderWidth;
			ctx.strokeStyle = element.options.borderColor;

			ctx.setLineDash([3, 3]);

			drawRoundedRect(ctx, left, top, width, height, element.options.borderRadius);

			ctx.stroke();
			ctx.save();
		});
	},
};
