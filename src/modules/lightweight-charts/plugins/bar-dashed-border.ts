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
	ctx.moveTo(x, y + height);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.lineTo(x + width - r, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + r);
	ctx.lineTo(x + width, y + height);
}

function drawRoundedRectFilled(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	const r = Math.min(radius, width / 2, height / 2);

	ctx.beginPath();
	ctx.moveTo(x, y + height);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.lineTo(x + width - r, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + r);
	ctx.lineTo(x + width, y + height);
	ctx.lineTo(x, y + height);
	ctx.closePath();
}

const originalColors = new Map();

export const barDashedBorderPlugin = {
	id: 'DashedBorder',
	beforeDatasetDraw(_chart: Chart<'bar'>, args: { index: number; meta: ChartMeta<'bar'> }) {
		args.meta.data.forEach(function (element, index) {
			const bg = element.options.backgroundColor as string;

			// FIXME PLEASE FIX
			// So... I doesnt fixed it, but wrapped to another function.
			// Yea we still searching by css part of css property
			if (bg && bg.includes('255, 127, 53')) {
				const key = `${args.index}-${index}`;
				originalColors.set(key, bg);
				element.options.backgroundColor = 'transparent';
			}
		});
	},
	afterDatasetDraw(chart: Chart<'bar'>, args: { index: number; meta: ChartMeta<'bar'> }) {
		args.meta.data.forEach(function (element, index) {
			// @ts-expect-error non-error, cause empty object provides by default
			if (typeof element.height === 'number' && element.height === 0) {
				return;
			}

			const { ctx } = chart;

			// @ts-expect-error non-error, cause empty object provides by default
			const half = element.width / 2;
			const left = element.x - half;
			const right = element.x + half;
			const top = element.y;
			const width = right - left;
			// @ts-expect-error non-error, cause empty object provides by default
			const { height } = element;
			const { bottom } = chart.chartArea;

			const key = `${args.index}-${index}`;
			const originalColor = originalColors.get(key);

			if (originalColor) {
				const gradient = ctx.createLinearGradient(left, bottom, left, top);
				gradient.addColorStop(0, 'rgba(153, 76, 32, 0.14)');
				gradient.addColorStop(1, 'rgba(255, 127, 53, 0.20)');

				ctx.fillStyle = gradient;
				drawRoundedRectFilled(ctx, left, top, width, height, element.options.borderRadius);
				ctx.fill();

				ctx.setLineDash([3, 3]);
				ctx.strokeStyle = '#FF8D29';

				element.options.backgroundColor = originalColor;
			} else {
				ctx.setLineDash([]);
				ctx.strokeStyle = '#FFFFFF';
			}

			ctx.lineWidth = element.options.borderWidth ?? 1;
			drawRoundedRect(ctx, left, top, width, height, element.options.borderRadius);
			ctx.stroke();
			ctx.save();
		});
	},
};
