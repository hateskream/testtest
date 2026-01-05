import type { CSSProperties } from 'vue';

export interface IMetricItem {
	label: string;
	value: number | 'N/A';
}

export interface IColorDotItem {
	color: CSSProperties['color'];
}

export interface IWeeklyDayInfo {
	date: Date;
	dayNumber: number;
	weekdayShort: string;
	weekdayLong: string;
	isToday: boolean;
	metrics: IMetricItem[];
	colorDots: IColorDotItem[];
}
