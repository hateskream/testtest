import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IGetCapitalMetricsRequest } from './get-capital-metrics.ts';
import { CapitalMetricsSchema } from '../model';
import { apiSchema } from '@/shared/service/api';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import { MarketType } from '@/modules/market';

const CapitalMetricsResponseMockSchema = z.object({
	[MarketType.Stock]: CapitalMetricsSchema.omit({ tickerId: true }),
	[MarketType.Etf]: CapitalMetricsSchema.omit({ tickerId: true }),
});

type CapitalMetricsResponseMock = z.infer<typeof CapitalMetricsResponseMockSchema>;

const { getMock } = useFetchMock<CapitalMetricsResponseMock>('/mock/widgets/capital-metrics.json');

export async function getMockData(request: IGetCapitalMetricsRequest) {
	await delay(2000);

	const response = await getMock();
	const market = resolveMarketTypeFromTicker(request.tickerId) as MarketType.Etf | MarketType.Stock;

	return apiSchema(CapitalMetricsSchema).parse({
		tickerId: request.tickerId,
		...response[market],
	});
}
