import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { getMockData } from './mock';
import { ValuationMetricsSchema } from '../model';

const IS_USE_MOCK = true;

export interface IGetValuationMetricsRequest {
	tickerId: string;
}

export async function getValuationMetrics(request: IGetValuationMetricsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return apiClient.get('/api/v1/valuation-metrics/data', apiSchema(ValuationMetricsSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get ticker valuation metrics', { error: error as Error });
		throw error;
	}
}
