import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { getMockData } from './mock';
import { CapitalMetricsSchema } from '../model';

const IS_USE_MOCK = true;

export interface IGetCapitalMetricsRequest {
	tickerId: string;
}

export async function getCapitalMetrics(request: IGetCapitalMetricsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return apiClient.get(
			'/api/v1/capital-metrics/data',
			apiSchema(CapitalMetricsSchema),
			{
				query: {
					ticker_id: request.tickerId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get ticker capital metrics', {
			error: error as Error,
		});
		throw error;
	}
}
