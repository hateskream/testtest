import type { BarElement, Chart, Plugin } from 'chart.js';

import type { BarDataset } from '@/modules/lightweight-charts';

export interface IBarDashedBorderPluginConfig {
	dashedBorder: {
		dash: [number, number];
		dashOffset: number;
		width: number;
		color: string;
		radius: number;
	};
}

function drawRoundedRectPath(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	radius: number,
) {
	const r = Math.min(radius, w / 2, h / 2);

	ctx.beginPath();
	ctx.moveTo(x, y + h);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h);
}

export const barDashedBorderConfigurablePlugin: Plugin = {
	id: 'DashedBorder',
	afterDatasetsDraw(chart: Chart<'bar'>) {
		const { ctx } = chart;
		const chartArea = chart.chartArea || { left: 0, right: chart.width, top: 0, bottom: chart.height };

		chart.data.datasets.forEach((ds: BarDataset & Partial<IBarDashedBorderPluginConfig>, datasetIndex) => {
			const meta = chart.getDatasetMeta(datasetIndex);
			if (!meta || meta.type !== 'bar') {
				return;
			}

			if (!ds.dashedBorder) {
				return;
			}

			const bars = (meta.data || []) as (BarElement & { width?: number; base: number })[];

			const {
				dash = [2, 2],
				dashOffset = 0,
				width: strokeWidth = 2,
				color: strokeColor = 'rgba(0, 0, 0, 1)',
				radius = 0,
			} = ds.dashedBorder;

			// ограничиваем областью просмотра графика
			ctx.save();
			ctx.beginPath();
			ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
			ctx.clip();

			bars.forEach(el => {
				if (!el || typeof el.x === 'undefined' || typeof el.y === 'undefined') {
					return;
				}

				const left = el.x - (el.width ?? 0) / 2;
				const right = el.x + (el.width ?? 0) / 2;
				const top = Math.min(el.y, el.base);
				const bottom = Math.max(el.y, el.base);
				const width = right - left;
				const height = bottom - top;

				// Пропускаем нулевые размеры
				if (Math.abs(width) < 0.5 || Math.abs(height) < 0.5) {
					return;
				}

				ctx.lineWidth = strokeWidth;
				ctx.setLineDash(dash);
				ctx.lineDashOffset = dashOffset;
				ctx.strokeStyle = strokeColor;
				ctx.lineJoin = 'round';

				// Ограничиваем видимый прямоугольник внутри chartArea
				const drawLeft = Math.max(left, chartArea.left);
				const drawTop = Math.max(top, chartArea.top);
				const drawRight = Math.min(right, chartArea.right);
				const drawBottom = Math.min(bottom, chartArea.bottom);
				const drawW = drawRight - drawLeft;
				const drawH = drawBottom - drawTop;

				if (drawW > 0.5 && drawH > 0.5) {
					drawRoundedRectPath(ctx, drawLeft, drawTop, drawW, drawH, radius);
					ctx.stroke();
				}

				ctx.setLineDash([]);
				ctx.restore();
			});
		});
	},
};
