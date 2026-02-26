import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const stochrsiSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	paneIndex: 9,
	isPrice: false,
	options: {
		color: '#673ab7',
		priceLineVisible: false,
		title: 'STOCHRSI',
	},
});
