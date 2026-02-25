import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const stochSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	paneIndex: 2,
	options: {
		color: '#00bcd4',
		priceLineVisible: false,
		title: 'STOCH',
	},
});
