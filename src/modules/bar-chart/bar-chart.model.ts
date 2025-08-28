import type { CSSProperties } from 'vue';

export interface IBarChartModel {
	minValue: number;
	maxValue: number;
	startValue?: number;
	currentValue: number;
	barColor?: CSSProperties['color'];
	compact?: boolean;
}
