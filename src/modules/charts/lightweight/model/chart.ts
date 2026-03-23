import type { CandlestickData, ChartClickData, ChartData } from '@shared/component-library';

export const TypeChart = {
	Candlestick: 'Candlestick',
	Line: 'Line',
} as const;

export type TypeChart = (typeof TypeChart)[keyof typeof TypeChart];

export type SharedChartMouseEvent = CustomEvent<ChartClickData[]>;

export function isCandlestickData(data: ChartData): data is CandlestickData {
	return 'close' in data;
}
