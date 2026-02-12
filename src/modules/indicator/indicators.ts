export const IndicatorKey = {
	SMA: 'sma',
	EMA: 'ema',
	RSI: 'rsi',
} as const;

export type IndicatorType = typeof IndicatorKey[keyof typeof IndicatorKey];

export interface IIndicatorConfig {
	title: string;
	label: string;
}

export const IndicatorsConfig = {
	[IndicatorKey.SMA]: {
		title: 'Simple Moving Average',
		label: 'SMA',
	},
	[IndicatorKey.RSI]: {
		title: 'Relative Strength Index',
		label: 'RSI',
	},
	[IndicatorKey.EMA]: {
		title: 'Exponential Moving Average',
		label: 'EMA',
	},
} as const satisfies Record<IndicatorType, IIndicatorConfig>;
