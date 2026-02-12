import type { SeriesType } from 'lightweight-charts';

import { Indicator, type IndicatorType } from './indicators.ts';
import { smaSeriesConfig } from './sma';
import type { SeriesConfig } from '@/modules/indicator/base';

const config = {
	[Indicator.SMA]: smaSeriesConfig,
	[Indicator.RSI]: smaSeriesConfig,
	[Indicator.EMA]: smaSeriesConfig,
} as const satisfies Record<IndicatorType, SeriesConfig<SeriesType>>;

export function getIndicatorSeriesConfig(indicator: IndicatorType) {
	return config[indicator];
}
