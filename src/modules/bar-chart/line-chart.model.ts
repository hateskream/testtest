import type { CSSProperties } from 'vue';

export interface ILineChartModel {
	value: number;
	barColor?: CSSProperties['color'];
	compact?: boolean;
	pale?: boolean;
}
