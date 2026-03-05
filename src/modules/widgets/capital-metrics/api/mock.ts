import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IGetCapitalMetricsRequest } from './get-capital-metrics.ts';
import { CapitalMetricsSchema } from '../model';
import { apiSchema } from '@/shared/service/api';

const CapitalMetricsResponseMockSchema = CapitalMetricsSchema.omit({
	tickerId: true,
});

type CapitalMetricsResponseMock = z.infer<typeof CapitalMetricsResponseMockSchema>;

const { getMock } = useFetchMock<CapitalMetricsResponseMock>('/mock/widgets/capital-metrics.json');

export async function getMockData(request: IGetCapitalMetricsRequest) {
	await delay(2000);

	const response = await getMock();

	return apiSchema(CapitalMetricsSchema).parse({
		tickerId: request.tickerId,
		...response,
	});
}
