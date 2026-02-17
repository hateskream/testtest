import type { SeriesType } from 'lightweight-charts';

import type { SeriesConfig } from './base';
import { IndicatorKey, type IndicatorType } from './indicators.ts';
import { smaSeriesConfig } from './trend/sma';
import { emaSeriesConfig } from './trend/ema';
import { rsiSeriesConfig } from './momentum/rsi';

const config = {
	[IndicatorKey.SMA]: smaSeriesConfig,
	[IndicatorKey.EMA]: emaSeriesConfig,
	[IndicatorKey.RSI]: rsiSeriesConfig,
} as const satisfies Record<IndicatorType, SeriesConfig<SeriesType>>;

export function getIndicatorSeriesConfig(indicator: IndicatorType) {
	return config[indicator];
}
