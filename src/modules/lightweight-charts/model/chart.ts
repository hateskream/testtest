import type { CandlestickData, ChartClickData, ChartData } from '@shared/component-library';

import { isNumber } from '@/shared/lib';
import { getTimezoneOffsetInMinutes, type TimezoneUtcType } from '@/modules/lightweight-charts/model/timezone.ts';
import {
	millisecondsToUtcSeconds,
	secondsToUtcSeconds,
	type UtcSeconds,
} from '@/modules/lightweight-charts/model/timestamp.ts';

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

export function strTimeToChartTime(time: string): UtcSeconds {
	const ms = Date.parse(time);
	return millisecondsToUtcSeconds(ms);
}

export function chartTimeToDate(time: number | string) {
	return new Date(isNumber(time) ? time * 1000 : time);
}

export function timeToZonedTime(seconds: UtcSeconds, timezone: TimezoneUtcType): UtcSeconds {
	const offset = getTimezoneOffsetInMinutes(timezone);
	return secondsToUtcSeconds(seconds + offset * 60);
}

export function zonedTimeToTime(zoned: UtcSeconds, timezone: TimezoneUtcType): UtcSeconds {
	const offset = getTimezoneOffsetInMinutes(timezone);
	return secondsToUtcSeconds(zoned - offset * 60);
}
