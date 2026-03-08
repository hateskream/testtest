import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { WhaleHoldingsSchema, WHALES_TOP_HOLDERS_GROUP_KEY } from '../model';
import { getMockData } from './mock';
import type { IGetWhaleHoldingsRequest } from './contract.ts';

const IS_USE_MOCK = true;

export async function getWhaleHoldings(request: IGetWhaleHoldingsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return await apiClient.get(
			'/api/v1/top-holders/data',
			apiSchema(WhaleHoldingsSchema),
			{
				query: {
					ticker_id: request.tickerId,
					group_by: WHALES_TOP_HOLDERS_GROUP_KEY,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get whales holdings', {
			error: error as Error,
		});

		throw error;
	}
}
