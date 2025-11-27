import { type Chart, type Plugin } from 'chart.js';

type MaybeGridColor = string | undefined | (({ index }: { index: number }) => string | undefined);

function resolveColor(color: MaybeGridColor) {
	if (typeof color === 'function') {
		return color({ index: 10 });
	}

	return color;
}

export const barUnderlineTicksPlugin: Plugin = {
	id: 'underlineTicks',
	afterDraw(chart: Chart<'bar'>) {
		const { ctx, scales: { y } } = chart;

		const rawColor = chart.config.options?.scales?.y?.grid?.color as MaybeGridColor;
		const color = resolveColor(rawColor) ?? '#666';

		const rawDash = chart.config.options?.scales?.y?.border?.dash;
		const dash = Array.isArray(rawDash) ? rawDash as number[] : [2, 2];

		y.ticks.forEach((_, index) => {
			const yPos = y.getPixelForTick(index);

			ctx.save();

			ctx.strokeStyle = color;
			ctx.lineWidth = 1;

			ctx.beginPath();
			ctx.moveTo(y.left - dash[0]!, yPos);
			ctx.lineTo(y.right, yPos);

			if (index > 0) {
				ctx.setLineDash(dash);
			}

			ctx.stroke();
			ctx.restore();
		});
	},
};
