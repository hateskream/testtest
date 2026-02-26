import { HistogramSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const aoSeriesConfig = defineSeriesConfig({
	definition: HistogramSeries,
	paneIndex: 7,
	isPrice: false,
	options: {
		color: '#795548',
		priceLineVisible: false,
		title: 'AO',
	},
});
