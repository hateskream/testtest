import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const willrSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	paneIndex: 8,
	isPrice: false,
	options: {
		color: '#9e9e9e',
		priceLineVisible: false,
		title: 'WILLR',
	},
});
