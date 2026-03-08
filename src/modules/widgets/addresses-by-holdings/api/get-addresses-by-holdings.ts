import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { getMockData } from './mock';
import { AddressesByHoldingsSchema, HOLDINGS_TOP_HOLDERS_GROUP_KEY } from '../model';

const IS_USE_MOCK = true;

export interface IGetAddressesByHoldingsRequest {
	tickerId: string;
}

export async function getAddressesByHoldings(request: IGetAddressesByHoldingsRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return await apiClient.get(
			'/api/v1/top-holders/data',
			apiSchema(AddressesByHoldingsSchema),
			{
				query: {
					ticker_id: request.tickerId,
					group_by: HOLDINGS_TOP_HOLDERS_GROUP_KEY,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get addresses by holdings', {
			error: error as Error,
		});

		throw error;
	}
}
