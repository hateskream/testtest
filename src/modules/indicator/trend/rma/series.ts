import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const rmaSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	options: {
		color: '#3f51b5',
		priceLineVisible: false,
		title: 'RMA',
	},
});
