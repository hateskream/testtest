import { LastPriceAnimationMode, LineStyle } from 'lightweight-charts';
import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const rsiSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	paneIndex: 1,
	options: {
		color: '#7e57c2',
		lineStyle: LineStyle.Solid,
		lineWidth: 1,
		lastPriceAnimation: LastPriceAnimationMode.Disabled,
		priceLineVisible: false,
		title: 'RSI',
	},
});
