import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { PriceTargetSchema, type PriceTarget } from '../model';
import type { IGetPriceTargetRequest } from './contract';
import { getMockData } from './mock';

const IS_USE_MOCK = true;

export async function getPriceTarget(
	request: IGetPriceTargetRequest,
): Promise<PriceTarget> {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData();
		}

		return apiClient.get(
			'/api/v1/price-target/data',
			apiSchema(PriceTargetSchema),
			{
				query: {
					ticker_id: request.tickerId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get price target data', { error: error as Error });
		throw error;
	}
}
