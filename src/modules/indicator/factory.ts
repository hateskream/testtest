import { IndicatorKey, type IndicatorType } from './indicators.ts';
import { Indicator } from './base';
import { createSma, type ISmaConfig } from './trend/sma';
import { createEma, type IEmaConfig } from './trend/ema';
import { createRsi, type IRsiConfig } from './momentum/rsi';

interface IIndicatorConfigMap {
	[IndicatorKey.SMA]: ISmaConfig;
	[IndicatorKey.EMA]: IEmaConfig;
	[IndicatorKey.RSI]: IRsiConfig;
}

const indicatorRegistry: {
	[K in IndicatorType]: (
		config?: IIndicatorConfigMap[K]
	) => Indicator;
} = {
	[IndicatorKey.SMA]: createSma,
	[IndicatorKey.EMA]: createEma,
	[IndicatorKey.RSI]: createRsi,
};

export function createIndicator<T extends IndicatorType>(
	type: T,
	config?: IIndicatorConfigMap[T],
) {
	return indicatorRegistry[type](config) as ReturnType<typeof indicatorRegistry[T]>;
}
