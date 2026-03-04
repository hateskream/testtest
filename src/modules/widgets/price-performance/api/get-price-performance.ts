import { useLogger } from '@/shared/service/monitoring';
import type { IPricePerformanceRequest } from './contract';
import { getMockData } from './mock';
import { PricePerformanceSchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = false;

export async function getPricePerformance(request: IPricePerformanceRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return apiClient.get('/api/v1/price-performance/data', apiSchema(PricePerformanceSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get ticker activity metrics', { error: error as Error });
		throw error;
	}
}
