import { LineSeries } from '@shared/component-library';

import { defineSeriesConfig } from '../../base';

export const atrSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	paneIndex: 6,
	isPrice: false,
	options: {
		color: '#ff6f00',
		priceLineVisible: false,
		title: 'ATR',
	},
});
