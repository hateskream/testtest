import type { CandlestickData, Time } from 'lightweight-charts';
import { differenceInSeconds, fromUnixTime } from 'date-fns';

import { TypeChart } from './chart.ts';

const transformers = {
	[TypeChart.Line]: convertCandlesToLineSeries,
	[TypeChart.Candlestick]: (data: CandlestickData[]) => data,
} as const;

export function convertCandlesToLineSeries(data: CandlestickData[]) {
	return data.map(item => ({ time: item.time, value: item.close }));
}

export function adaptSeriesToChartType(data: CandlestickData[], type: TypeChart) {
	return transformers[type]?.(data) ?? data;
}

export function groupSeriesByRange<T extends { time: Time }>(data: T[], diffInSec: number): T[] {
	if (diffInSec === -1) {
		return data;
	}

	return data.reduce((acc, item) => {
		if (differenceInSeconds(fromUnixTime(+item.time), fromUnixTime(+acc[acc.length - 1].time)) >= diffInSec) {
			acc.push(item);
		}

		return acc;
	}, [data[0]]);
}
