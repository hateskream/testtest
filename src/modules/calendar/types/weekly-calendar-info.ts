import type { CSSProperties } from 'vue';

export interface IWeeklyDayInfo {
	date: Date;
	dayNumber: number;
	weekdayShort: string;
	weekdayLong: string;
	isToday: boolean;
	metrics: { label: string; value: number | 'N/A' }[];
	colorDots: { color: CSSProperties['color'] }[];
}
