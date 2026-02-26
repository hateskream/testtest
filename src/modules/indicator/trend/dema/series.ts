import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const demaSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	options: {
		color: '#009688',
		priceLineVisible: false,
		title: 'DEMA',
	},
});
