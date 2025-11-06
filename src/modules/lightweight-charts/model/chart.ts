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

export interface ISharedChartMouseEventDetails {
	time: number | string;
	value: number;
	x: number;
	y: number;
}

export type SharedChartMouseEvent = CustomEvent<[ISharedChartMouseEventDetails | null]>;
