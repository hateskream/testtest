import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IPricePerformanceRequest } from './contract';
import { MarketType } from '@/modules/market';
import {
	CommodityPricePerformanceSchema,
	CryptoPricePerformanceSchema,
	EtfPricePerformanceSchema,
	ForexPricePerformanceSchema,
	IndexPricePerformanceSchema,
	StockPricePerformanceSchema,
} from '../model';
import { apiSchema } from '@/shared/service/api';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

const PricePerformanceResponseMockSchema = apiSchema(z.object({
	[MarketType.Crypto]: CryptoPricePerformanceSchema.omit({ tickerId: true }),
	[MarketType.Stock]: StockPricePerformanceSchema.omit({ tickerId: true }),
	[MarketType.Forex]: ForexPricePerformanceSchema.omit({ tickerId: true }),
	[MarketType.Etf]: EtfPricePerformanceSchema.omit({ tickerId: true }),
	[MarketType.Indices]: IndexPricePerformanceSchema.omit({ tickerId: true }),
	[MarketType.Commodities]: CommodityPricePerformanceSchema.omit({ tickerId: true }),
}));

const { getMock } = useFetchMock('/mock/widgets/price-performance.json');

export async function getMockData(request: IPricePerformanceRequest) {
	await delay(2000);

	const tickers = await getMock();
	const market = resolveMarketTypeFromTicker(request.tickerId)!;

	const preparedTickers = PricePerformanceResponseMockSchema.parse(tickers);

	return {
		tickerId: request.tickerId,
		...preparedTickers[market],
	};
}
