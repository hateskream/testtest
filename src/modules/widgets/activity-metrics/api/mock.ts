import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IActivityMetricsRequest } from './contract.ts';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import { MarketType } from '@/modules/market';
import {
	CommodityActivityMetricsSchema,
	CryptoActivityMetricsSchema,
	EtfActivityMetricsSchema,
	ForexActivityMetricsSchema,
	IndexActivityMetricsSchema,
	StockActivityMetricsSchema,
} from '@/modules/widgets/activity-metrics/model';
import { apiSchema } from '@/shared/service/api';

const ActivityMetricsResponseMockSchema = apiSchema(z.object({
	[MarketType.Crypto]: CryptoActivityMetricsSchema.omit({ tickerId: true }),
	[MarketType.Stock]: StockActivityMetricsSchema.omit({ tickerId: true }),
	[MarketType.Forex]: ForexActivityMetricsSchema.omit({ tickerId: true }),
	[MarketType.Etf]: EtfActivityMetricsSchema.omit({ tickerId: true }),
	[MarketType.Indices]: IndexActivityMetricsSchema.omit({ tickerId: true }),
	[MarketType.Commodities]: CommodityActivityMetricsSchema.omit({ tickerId: true }),
}));

const { getMock } = useFetchMock('/mock/widgets/activity-metrics.json');

export async function getMockData(request: IActivityMetricsRequest) {
	await delay(2000);

	const tickers = await getMock();
	const market = resolveMarketTypeFromTicker(request.tickerId)!;

	const preparedTickers = ActivityMetricsResponseMockSchema.parse(tickers);

	return {
		tickerId: request.tickerId,
		...preparedTickers[market],
	};
}
