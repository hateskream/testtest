import { LineSeries } from 'lightweight-charts';

import { defineSeriesConfig } from '../base';

export const smaSeriesConfig = defineSeriesConfig({
	definition: LineSeries,
	options: {
		color: 'blue',
		lineWidth: 2,
	},
});

