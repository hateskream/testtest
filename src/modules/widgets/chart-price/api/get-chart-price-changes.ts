import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { delay } from '@/shared/lib';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { PriceChangesSchema } from '../model';

const IS_USE_MOCK = true;

export type GetChartPriceChangesRequest = {
	ticker: string;
};

export const ChartPriceChangesResponseSchema = apiSchema(z.object({
	ticker: z.string(),
	changes: PriceChangesSchema,
}));

export function getChartPriceChanges(request: GetChartPriceChangesRequest) {
	if (IS_USE_MOCK) {
		return getMockData(request);
	}

	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		return apiClient.get(
			'/api/v1/price_chart/history',
			ChartPriceChangesResponseSchema,
			{ query: request },
		);
	} catch (error) {
		logger.error('Failed to get Price Changes data', { error: error as Error });
		throw error;
	}
}

async function getMockData(request: GetChartPriceChangesRequest) {
	await delay(500);

	return ChartPriceChangesResponseSchema.parse({
		ticker: request.ticker,
		changes: {
			'1D': 0.9012121,
			'1W': -14.3826528,
			'1M': -16.5912783,
			'6M': -35.0672313,
			'1Y': -24.8812154,
			'ALL': 699092.1212143,
		},
	});
}
