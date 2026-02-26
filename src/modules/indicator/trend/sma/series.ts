import { LastPriceAnimationMode, LineStyle } from 'lightweight-charts';
import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const smaSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	options: {
		color: '#2962ff',
		lineStyle: LineStyle.Solid,
		lineWidth: 1,
		lastPriceAnimation: LastPriceAnimationMode.Disabled,
		priceLineVisible: false,
		title: 'SMA',
	},
});
