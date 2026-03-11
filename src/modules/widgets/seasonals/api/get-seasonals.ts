import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import type { ISeasonalsRequest } from './contract';
import { getMockData } from './mock';
import { SeasonalsResponseSchema } from '../model';

const IS_USE_MOCK = true;

export async function getSeasonals(request: ISeasonalsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return apiClient.get(
			'/api/v1/seasonals/data',
			apiSchema(SeasonalsResponseSchema),
			{
				query: {
					ticker_id: request.tickerId,
					currency: request.currency,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get seasonals data', { error: error as Error });
		throw error;
	}
}
