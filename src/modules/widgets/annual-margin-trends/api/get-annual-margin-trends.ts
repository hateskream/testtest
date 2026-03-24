import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import type { IAnnualMarginTrendsRequest } from './contract';
import { getMockData } from './mock';
import { AnnualMarginTrendsResponseSchema } from '../model';

const IS_USE_MOCK = true;

export async function getAnnualMarginTrends(request: IAnnualMarginTrendsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return await apiClient.get(
			'/api/v1/annual-margin-trends/data',
			apiSchema(AnnualMarginTrendsResponseSchema),
			{
				query: {
					ticker_id: request.tickerId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get annual margin trends data', { error: error as Error });
		throw error;
	}
}
