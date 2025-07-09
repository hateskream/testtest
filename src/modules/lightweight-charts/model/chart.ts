export const RangeChart = {
	'1D': '1D',
	'1W': '1W',
	'1M': '1M',
	'6M': '6M',
	'1Y': '1Y',
	'3Y': '3Y',
	'5Y': '5Y',
	'10Y': '10Y',
	'ALL': 'ALL',
} as const;

export type RangeChart = (typeof RangeChart)[keyof typeof RangeChart];

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
