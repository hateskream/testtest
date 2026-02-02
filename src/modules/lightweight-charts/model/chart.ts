import type { CandlestickData, ChartClickData, ChartData } from '@shared/component-library';

import { isNumber } from '@/shared/lib';

export const IndicatorsChart = {
	Main: 'Main',
	SMA: 'SMA',
} as const;

export type IndicatorsChart = (typeof IndicatorsChart)[keyof typeof IndicatorsChart];


export const TypeChart = {
	Candlestick: 'Candlestick',
	Line: 'Line',
} as const;

export type TypeChart = (typeof TypeChart)[keyof typeof TypeChart];


export interface IChartUpdateEmitData {
	value: number;
	time: Date;
}

export type SharedChartMouseEvent = CustomEvent<ChartClickData[]>;

export function isCandlestickData(data: ChartData): data is CandlestickData {
	return 'close' in data;
}

export function strTimeToChartTime(time: string): number {
	const ms = Date.parse(time);
	return Math.floor(ms / 1000);
}

export function chartTimeToDate(time: number | string) {
	return new Date(isNumber(time) ? time * 1000 : time);
}
