export const IndicatorKey = {
	// trend
	SMA: 'sma',
	EMA: 'ema',
	// DEMA: 'dema',
	// MACD: 'macd',
	// RMA: 'rma',
	// SMMA: 'smma',
	// WMA: 'wma',
	// LINREG: 'linreg',
	// CCI: 'cci',
	//
	// // momentum
	// AO: 'ao',
	// STOCH: 'stoch',
	RSI: 'rsi',
	// STOCHRSI: 'stochrsi',
	// TDS: 'tds',
	// WILLR: 'willr',
	//
	// // volatility
	// ABANDS: 'abands',
	// TR: 'tr',
	// ATR: 'atr',
	// BBANDS: 'bbands',
	// BBW: 'bbw',
} as const;

export type IndicatorType = typeof IndicatorKey[keyof typeof IndicatorKey];

export interface IIndicatorConfig {
	title: string;
	label: string;

	/**
	 * Минимальное количество точек для построения индикатора
	 * Например, для SMA нужно 14 точек.
	 */
	minPoints: number;
}

export const IndicatorsConfig = {
	[IndicatorKey.SMA]: {
		title: 'Simple Moving Average',
		label: 'SMA',
		minPoints: 14,
	},
	[IndicatorKey.EMA]: {
		title: 'Exponential Moving Average',
		label: 'EMA',
		minPoints: 9,
	},
	// [IndicatorKey.DEMA]: {
	// 	title: 'Double Exponential Moving Average',
	// 	label: 'DEMA',
	// },
	// [IndicatorKey.MACD]: {
	// 	title: 'Moving Average Convergence Divergence',
	// 	label: 'MACD',
	// },
	// [IndicatorKey.RMA]: {
	// 	title: 'Relative Moving Average',
	// 	label: 'RMA',
	// },
	// [IndicatorKey.SMMA]: {
	// 	title: 'Smoothed Moving Average',
	// 	label: 'SMMA',
	// },
	// [IndicatorKey.WMA]: {
	// 	title: 'Weighted Moving Average',
	// 	label: 'WMA',
	// },
	// [IndicatorKey.LINREG]: {
	// 	title: 'Linear Regression',
	// 	label: 'LINREG',
	// },
	// [IndicatorKey.CCI]: {
	// 	title: 'Commodity Channel Index',
	// 	label: 'CCI',
	// },

	// momentum
	// [IndicatorKey.AO]: {
	// 	title: 'Awesome Oscillator',
	// 	label: 'AO',
	// },
	// [IndicatorKey.STOCH]: {
	// 	title: 'Stochastic Oscillato',
	// 	label: 'STOCH',
	// },
	[IndicatorKey.RSI]: {
		title: 'Relative Strength Index',
		label: 'RSI',
		minPoints: 14,
	},
	// [IndicatorKey.STOCHRSI]: {
	// 	title: 'Stochastic RSI',
	// 	label: 'STOCHRSI',
	// },
	// [IndicatorKey.TDS]: {
	// 	title: 'Tom Demark\'s Sequential Indicator',
	// 	label: 'TDS',
	// },
	// [IndicatorKey.WILLR]: {
	// 	title: 'Williams %R',
	// 	label: 'WILLR',
	// },

	// volatility
	// [IndicatorKey.ABANDS]: {
	// 	title: 'Acceleration Bands %R',
	// 	label: 'ABANDS',
	// },
	// [IndicatorKey.TR]: {
	// 	title: 'True Range',
	// 	label: 'TR',
	// },
	// [IndicatorKey.ATR]: {
	// 	title: 'Average True Range',
	// 	label: 'ATR',
	// },
	// [IndicatorKey.BBANDS]: {
	// 	title: 'Bollinger Bands',
	// 	label: 'BBANDS',
	// },
	// [IndicatorKey.BBW]: {
	// 	title: 'Bollinger Bands Width',
	// 	label: 'BBW',
	// },
} as const satisfies Record<IndicatorType, IIndicatorConfig>;

// Оставшиеся индикаторы из trading-signals:
//
// Accelerator Oscillator (AC)
// Average Directional Index (ADX)
// Center of Gravity (CG)
// Directional Movement Index (DMI / DX)
// Dual Moving Average (DMA)
// Interquartile Range (IQR)
// Mean Absolute Deviation (MAD)
// Momentum (MOM / MTM)
// On-Balance Volume (OBV)
// Parabolic SAR (PSAR)
// Range Expansion Index (REI)
// Rate-of-Change (ROC)
// Spencer's 15-Point Moving Average (SMA15)
// Volume-Weighted Average Price (VWAP)
// Zig Zag Indicator (ZigZag)
