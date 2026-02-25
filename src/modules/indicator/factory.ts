import { IndicatorKey, type IndicatorType } from './indicators.ts';
import { Indicator } from './base';
import { createSma, type ISmaConfig } from './trend/sma';
import { createEma, type IEmaConfig } from './trend/ema';
import { createMacd, type IMacdConfig } from './trend/macd';
import { createAdx, type IAdxConfig } from './trend/adx';
import { createDema, type IDemaConfig } from './trend/dema';
import { createRma, type IRmaConfig } from './trend/rma';
import { createWma, type IWmaConfig } from './trend/wma';
import { createRsi, type IRsiConfig } from './momentum/rsi';
import { createStoch, type IStochConfig } from './momentum/stoch';
import { createCci, type ICciConfig } from './momentum/cci';
import { createAO, type IAOConfig } from './momentum/ao';
import { createWillr, type IWillrConfig } from './momentum/willr';
import { createStochRsi, type IStochRsiConfig } from './momentum/stochrsi';
import { createAtr, type IAtrConfig } from './volatility/atr';
import { createBbands, type IBbandsConfig } from './volatility/bbands';

interface IIndicatorConfigMap {
	[IndicatorKey.SMA]: ISmaConfig;
	[IndicatorKey.EMA]: IEmaConfig;
	[IndicatorKey.MACD]: IMacdConfig;
	[IndicatorKey.ADX]: IAdxConfig;
	[IndicatorKey.DEMA]: IDemaConfig;
	[IndicatorKey.RMA]: IRmaConfig;
	[IndicatorKey.WMA]: IWmaConfig;
	[IndicatorKey.RSI]: IRsiConfig;
	[IndicatorKey.STOCH]: IStochConfig;
	[IndicatorKey.CCI]: ICciConfig;
	[IndicatorKey.AO]: IAOConfig;
	[IndicatorKey.WILLR]: IWillrConfig;
	[IndicatorKey.STOCHRSI]: IStochRsiConfig;
	[IndicatorKey.ATR]: IAtrConfig;
	[IndicatorKey.BBANDS]: IBbandsConfig;
}

const indicatorRegistry: {
	[K in IndicatorType]: (config?: IIndicatorConfigMap[K]) => Indicator;
} = {
	[IndicatorKey.SMA]: createSma,
	[IndicatorKey.EMA]: createEma,
	[IndicatorKey.MACD]: createMacd,
	[IndicatorKey.ADX]: createAdx,
	[IndicatorKey.DEMA]: createDema,
	[IndicatorKey.RMA]: createRma,
	[IndicatorKey.WMA]: createWma,
	[IndicatorKey.RSI]: createRsi,
	[IndicatorKey.STOCH]: createStoch,
	[IndicatorKey.CCI]: createCci,
	[IndicatorKey.AO]: createAO,
	[IndicatorKey.WILLR]: createWillr,
	[IndicatorKey.STOCHRSI]: createStochRsi,
	[IndicatorKey.ATR]: createAtr,
	[IndicatorKey.BBANDS]: createBbands,
};

export function createIndicator<T extends IndicatorType>(
	type: T,
	config?: IIndicatorConfigMap[T],
) {
	return indicatorRegistry[type](config) as ReturnType<
		(typeof indicatorRegistry)[T]
	>;
}
