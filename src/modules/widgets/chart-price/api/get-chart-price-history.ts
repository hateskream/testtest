import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { delay } from '@/shared/lib';
import { ChartPriceHistoryDataSchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';
import type { UtcSeconds } from '@/modules/charts/common/model';

const IS_USE_MOCK = false;

export type GetChartPriceHistoryRequest = {
	ticker: string;
	to: UtcSeconds;
	from: UtcSeconds;
};

export const ChartPriceHistoryResponseSchema = apiSchema(z.object({
	data: ChartPriceHistoryDataSchema,
}));

export function getChartPriceHistory(request: GetChartPriceHistoryRequest) {
	if (IS_USE_MOCK) {
		return getMockData();
	}

	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		return apiClient.get(
			'/api/v1/price_chart/history',
			ChartPriceHistoryResponseSchema,
			{ query: request },
		);
	} catch (error) {
		logger.error('Failed to get ChartPrice history data', { error: error as Error });
		throw error;
	}
}

async function getMockData() {
	await delay(500);

	const now = Date.now();

	return ChartPriceHistoryResponseSchema.parse({
		data: {
			points: Array.from({ length: 100 }).map((_it, key) => ({
				timestamp: (now + key * 60000).toString(),
				changePercent: 0,
				delta: 0,
				market_cap: '1000',
				volume: '1000',
				price_candle: {
					close: 100,
					high: 140,
					low: 60,
					open: 80,
				},
			})),
			current: {
				price: 99000,
				changePercent: 2.52453,
				delta: 2.52453,
				prevClosePrice: 96000,
				updatedAt: '2025-12-04T00:00:00.000Z',
			},
		},
	});
}
