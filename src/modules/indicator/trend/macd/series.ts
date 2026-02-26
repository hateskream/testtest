import { HistogramSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const macdSeriesConfig = defineSeriesConfig({
	definition: HistogramSeries,
	paneIndex: 5,
	isPrice: false,
	options: {
		color: '#26a69a',
		priceLineVisible: false,
		title: 'MACD',
	},
});
