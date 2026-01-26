import { useLogger } from '@/shared/service/logger';
import type { IActivityMetricsRequest } from './contract';
import { getMockData } from './mock';
import { ActivityMetricsSchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = true;

export async function getActivityMetrics(request: IActivityMetricsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return apiClient.get('/api/v1/insights-activity/data', apiSchema(ActivityMetricsSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});

	} catch (error) {
		logger.error('Failed to get ticker activity metrics', error as Error);
		throw error;
	}
}
