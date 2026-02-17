import { useLogger } from '@/shared/service/monitoring';
import type { IAnalystRatingsRequest } from './contract';
import { getMockData } from './mock';
import { AnalystRatingsSchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = true;

export async function getAnalystRatings(request: IAnalystRatingsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData();
		}

		return apiClient.get('/api/v1/analyst-ratings/data', apiSchema(AnalystRatingsSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get ticker analyst ratings', { error: error as Error });
		throw error;
	}
}
