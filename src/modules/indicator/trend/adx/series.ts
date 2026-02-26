import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const adxSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	paneIndex: 4,
	isPrice: false,
	options: {
		color: '#607d8b',
		priceLineVisible: false,
		title: 'ADX',
	},
});
