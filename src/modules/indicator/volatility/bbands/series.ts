import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const bbandsSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	options: {
		color: '#9c27b0',
		priceLineVisible: false,
		title: 'BBANDS',
	},
});
