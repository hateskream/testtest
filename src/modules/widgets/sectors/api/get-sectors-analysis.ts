import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import type { ISectorsRequest } from './contract';
import { getAnalysisMockData } from './mock';
import { SectorsAnalysisSchema } from '../model';

const IS_USE_MOCK = true;

export async function getSectorsAnalysis(request: ISectorsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getAnalysisMockData(request);
		}

		return apiClient.get('/api/v1/sectors/analysis', apiSchema(SectorsAnalysisSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get sectors analysis data', { error: error as Error });
		throw error;
	}
}
