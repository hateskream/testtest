/* eslint-disable @typescript-eslint/naming-convention */
import type { Color } from 'chart.js';

import type {
	DoughnutCenterTextPluginOptions,
	DoughnutFloatingLabelsPluginOptions,
	PreventLabelOverlapPluginOptions,
	SolidBottomLinePluginOptions,
	UnderlineDashTicksPluginOptions,
} from '@/modules/charts/chart-js/plugins';

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
	interface Chart {
		animating: boolean;
	}

	interface PluginOptionsByType<TType extends ChartType> {
		underlineDashTicks?: Partial<UnderlineDashTicksPluginOptions>;
		solidBottomLine?: Partial<SolidBottomLinePluginOptions>;
		doughnutCenterText?: Partial<DoughnutCenterTextPluginOptions>;
		doughnutFloatingLabels?: Partial<DoughnutFloatingLabelsPluginOptions>;
		preventLabelOverlap?: Partial<PreventLabelOverlapPluginOptions>;
	}

	interface Scale {
		_gridLineItems?: GridLineItem[];
	}

	interface ChartDatasetProperties {
		labels?: string[];
		color?: string[];
	}
}

declare module 'chartjs-plugin-annotation' {
	interface AnnotationElement {
		options?: { id?: string };
		label?: {
			options?: { display?: boolean };
		};
		inRange?: (x: number, y: number) => boolean;
	}

	interface LabelOptions {
		yMin?: number;
		yAdjust?: number;
	}
}
