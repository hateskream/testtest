import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IGetValuationMetricsRequest } from './get-valuation-metrics.ts';
import { ValuationMetricsSchema } from '../model';
import { apiSchema } from '@/shared/service/api';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import { MarketType } from '@/modules/market';

const ValuationMetricsResponseMockSchema = z.object({
	[MarketType.Stock]: ValuationMetricsSchema.omit({ tickerId: true }),
	[MarketType.Etf]: ValuationMetricsSchema.omit({ tickerId: true }),
});

type ValuationMetricsResponseMock = z.infer<typeof ValuationMetricsResponseMockSchema>;

const { getMock } = useFetchMock<ValuationMetricsResponseMock>('/mock/widgets/valuation-metrics.json');

export async function getMockData(request: IGetValuationMetricsRequest) {
	await delay(2000);

	const response = await getMock();
	const market = resolveMarketTypeFromTicker(request.tickerId) as MarketType.Etf | MarketType.Stock;

	return apiSchema(ValuationMetricsSchema).parse({
		tickerId: request.tickerId,
		...response[market],
	});
}
