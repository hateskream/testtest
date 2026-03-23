import type { CartesianScaleOptions, Plugin, Scale } from 'chart.js';

import { solidBottomLinePlugin } from './solid-bottom-line.ts';

export type UnderlineDashTicksPluginOptions = {
	scales?: string[];
};

const FALLBACK_COLOR = '#666';
const FALLBACK_DASH = [2, 2];

export const underlineDashTicksPlugin: Plugin<'line' | 'bar' | 'bubble', UnderlineDashTicksPluginOptions> = {
	id: 'underlineDashTicks',
	afterDraw(chart, _, options) {
		const { ctx, scales } = chart;

		const hasSolidBottomLinePlugin = chart.config.plugins?.includes(solidBottomLinePlugin);
		const firstTickShouldBeSkipped = hasSolidBottomLinePlugin
			&& chart.config.options?.plugins?.solidBottomLine?.mode === 'full';

		const targetScales = options?.scales ?? Object.keys(scales);

		targetScales.forEach((scaleId) => {
			const scale = scales[scaleId] as Scale<CartesianScaleOptions> | undefined;
			if (!scale) {
				return;
			}

			scale.ticks.forEach((_tick, index) => {
				if (index === 0 && firstTickShouldBeSkipped) {
					return;
				}

				const pos = scale.getPixelForTick(index);

				const color = scale._gridLineItems?.[index]?.color ?? FALLBACK_COLOR;
				const borderDash = scale._gridLineItems?.[index]?.borderDash ?? FALLBACK_DASH;

				ctx.save();

				ctx.strokeStyle = color;
				ctx.lineWidth = 1;

				ctx.beginPath();
				ctx.moveTo(scale.left - borderDash[0]!, pos);
				ctx.lineTo(scale.right, pos);

				ctx.setLineDash(borderDash);

				ctx.stroke();
				ctx.restore();
			});
		});
	},
};
