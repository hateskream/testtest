import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { apiSchema } from '@/shared/service/api';
import type { IAnnualMarginTrendsRequest } from './contract';
import { AnnualMarginTrendsResponseSchema } from '../model';

const AnnualMarginTrendsMockSchema = AnnualMarginTrendsResponseSchema.omit({ tickerId: true });

type AnnualMarginTrendsMock = z.infer<typeof AnnualMarginTrendsMockSchema>;

const { getMock } = useFetchMock<AnnualMarginTrendsMock>('/mock/widgets/annual-margin-trends.json');

export async function getMockData(request: IAnnualMarginTrendsRequest) {
	await delay(1000);

	const response = await getMock();

	return apiSchema(AnnualMarginTrendsResponseSchema).parse({
		tickerId: request.tickerId,
		...response,
	});
}
