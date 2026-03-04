import { useLogger } from '@/shared/service/monitoring';
import type { ISectorsRequest } from './contract';
import { getMockData } from './mock';
import { SectorsSchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = true;

export async function getSectors(request: ISectorsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return apiClient.get('/api/v1/sectors/data', apiSchema(SectorsSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get ticker activity metrics', { error: error as Error });
		throw error;
	}
}
