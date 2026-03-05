import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IGetValuationMetricsRequest } from './get-valuation-metrics.ts';
import { ValuationMetricsSchema } from '../model';
import { apiSchema } from '@/shared/service/api';

const ValuationMetricsResponseMockSchema = ValuationMetricsSchema.omit({ tickerId: true });

type ValuationMetricsResponseMock = z.infer<typeof ValuationMetricsResponseMockSchema>;

const { getMock } = useFetchMock<ValuationMetricsResponseMock>('/mock/widgets/valuation-metrics.json');

export async function getMockData(request: IGetValuationMetricsRequest) {
	await delay(2000);

	const response = await getMock();

	return apiSchema(ValuationMetricsSchema).parse({
		tickerId: request.tickerId,
		...response,
	});
}
