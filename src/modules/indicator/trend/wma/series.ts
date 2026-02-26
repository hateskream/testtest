import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const wmaSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	options: {
		color: '#e91e63',
		priceLineVisible: false,
		title: 'WMA',
	},
});
