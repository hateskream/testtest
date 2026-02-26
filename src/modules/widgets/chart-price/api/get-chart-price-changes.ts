import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { delay } from '@/shared/lib';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { PriceChangesSchema } from '../model';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = false;

export type GetChartPriceChangesRequest = {
	ticker: string;
};

export const ChartPriceChangesResponseSchema = apiSchema(z.object({
	ticker: z.string(),
	changes: PriceChangesSchema,
}));

type ChartPriceChangesResponse = z.infer<typeof ChartPriceChangesResponseSchema>;

export function getChartPriceChanges(request: GetChartPriceChangesRequest) {
	if (IS_USE_MOCK) {
		return getMockData();
	}

	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		return apiClient.get(
			'/api/v1/price_chart/changes',
			ChartPriceChangesResponseSchema,
			{ query: request },
		);
	} catch (error) {
		logger.error('Failed to get Price Changes data', { error: error as Error });
		throw error;
	}
}

const { getMock } = useFetchMock<ChartPriceChangesResponse>('/mock/widgets/price-changes.json');

async function getMockData() {
	await delay(500);
	return getMock();
}
