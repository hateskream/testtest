import type { Color } from 'chart.js';

import type {
	SolidBottomLinePluginOptions,
	UnderlineDashTicksPluginOptions,
} from '@/modules/lightweight-charts/plugins';

type GridLineItem = {
	tx1: number;
	ty1: number;
	tx2: number;
	ty2: number;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	width: number;
	borderDash: number[];
	borderDashOffset: number;
	tickWidth: number;
	tickColor: Color;
	tickBorderDash: number[];
	tickBorderDashOffset: number;
	color: Color;
};


declare module 'chart.js' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface PluginOptionsByType<TType extends ChartType> {
		underlineDashTicks?: Partial<UnderlineDashTicksPluginOptions>;
		solidBottomLine?: Partial<SolidBottomLinePluginOptions>;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Scale {
		_gridLineItems?: GridLineItem[];
	}
}

declare module 'chartjs-plugin-annotation' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface AnnotationElement {
		options?: { id?: string };
		label?: {
			options?: { display?: boolean };
		};
		inRange?: (x: number, y: number) => boolean;
	}
}
