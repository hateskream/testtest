import type { Color } from 'chart.js';

import type {
	DoughnutCenterTextPluginOptions,
	DoughnutFloatingLabelsPluginOptions,
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
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Chart {
		animating: boolean;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface PluginOptionsByType<TType extends ChartType> {
		underlineDashTicks?: Partial<UnderlineDashTicksPluginOptions>;
		solidBottomLine?: Partial<SolidBottomLinePluginOptions>;
		doughnutCenterText?: Partial<DoughnutCenterTextPluginOptions>;
		doughnutFloatingLabels?: Partial<DoughnutFloatingLabelsPluginOptions>;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Scale {
		_gridLineItems?: GridLineItem[];
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ChartDatasetProperties {
		labels?: string[];
		color?: string[];
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
