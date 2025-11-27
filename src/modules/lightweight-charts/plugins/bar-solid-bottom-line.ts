import { type Plugin } from 'chart.js';

type MaybeGridColor = string | undefined | (({ index }: { index: number }) => string | undefined);

function resolveColor(color: MaybeGridColor) {
	if (typeof color === 'function') {
		return color({ index: 10 });
	}

	return color;
}

export const barSolidBottomLinePlugin: Plugin = {
	id: 'solidBottomLine',
	afterDraw(chart) {
		const { ctx, chartArea } = chart;

		if (!chartArea) {
			return;
		}

		const rawColor = chart.config.options?.scales?.y?.grid?.color as MaybeGridColor;
		const color = resolveColor(rawColor) ?? '#666';

		const { left, right, bottom } = chartArea;

		ctx.save();
		ctx.beginPath();
		ctx.setLineDash([]);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.moveTo(left, bottom);
		ctx.lineTo(right, bottom);
		ctx.stroke();
		ctx.restore();
	},
};
