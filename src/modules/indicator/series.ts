import type { SeriesType } from 'lightweight-charts';

import type { SeriesConfig } from './base';
import { IndicatorKey, type IndicatorType } from './indicators.ts';
import { smaSeriesConfig } from './trend/sma';
import { emaSeriesConfig } from './trend/ema';
import { macdSeriesConfig } from './trend/macd';
import { adxSeriesConfig } from './trend/adx';
import { demaSeriesConfig } from './trend/dema';
import { rmaSeriesConfig } from './trend/rma';
import { wmaSeriesConfig } from './trend/wma';
import { rsiSeriesConfig } from './momentum/rsi';
import { stochSeriesConfig } from './momentum/stoch';
import { cciSeriesConfig } from './momentum/cci';
import { aoSeriesConfig } from './momentum/ao';
import { willrSeriesConfig } from './momentum/willr';
import { stochrsiSeriesConfig } from './momentum/stochrsi';
import { atrSeriesConfig } from './volatility/atr';
import { bbandsSeriesConfig } from './volatility/bbands';

const config = {
	[IndicatorKey.SMA]: smaSeriesConfig,
	[IndicatorKey.EMA]: emaSeriesConfig,
	[IndicatorKey.MACD]: macdSeriesConfig,
	[IndicatorKey.ADX]: adxSeriesConfig,
	[IndicatorKey.DEMA]: demaSeriesConfig,
	[IndicatorKey.RMA]: rmaSeriesConfig,
	[IndicatorKey.WMA]: wmaSeriesConfig,
	[IndicatorKey.RSI]: rsiSeriesConfig,
	[IndicatorKey.STOCH]: stochSeriesConfig,
	[IndicatorKey.CCI]: cciSeriesConfig,
	[IndicatorKey.AO]: aoSeriesConfig,
	[IndicatorKey.WILLR]: willrSeriesConfig,
	[IndicatorKey.STOCHRSI]: stochrsiSeriesConfig,
	[IndicatorKey.ATR]: atrSeriesConfig,
	[IndicatorKey.BBANDS]: bbandsSeriesConfig,
} as const satisfies Record<IndicatorType, SeriesConfig<SeriesType>>;

export function getIndicatorSeriesConfig(indicator: IndicatorType) {
	return config[indicator];
}
