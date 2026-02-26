import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const cciSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	paneIndex: 3,
	isPrice: false,
	options: {
		color: '#ff9800',
		priceLineVisible: false,
		title: 'CCI',
	},
});
