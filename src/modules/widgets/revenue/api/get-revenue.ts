import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { apiSchema, useApiClient } from '@/shared/service/api';
import {
	RevenueHistorySchema,
	RevenueMode,
	type RevenueModeType,
	RevenueQuarterlyHistorySchema,
	RevenueYearlyHistorySchema,
} from '../model';

const IS_USE_MOCK = true;

export interface IGetRevenueRequest {
	tickerId: string;
	mode: RevenueModeType;
}

export async function getRevenue(request: IGetRevenueRequest) {
	const client = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return await client.get(
			'/api/v1/revenue/data',
			apiSchema(RevenueHistorySchema),
			{
				query: {
					ticker_id: request.tickerId,
					mode: request.mode,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get Revenue data', { error: error as Error });
		throw error;
	}
}

const RevenueResponseMockSchema = z.object({
	[RevenueMode.Quarterly]: RevenueQuarterlyHistorySchema,
	[RevenueMode.Yearly]: RevenueYearlyHistorySchema,
});

type RevenueResponseMock = z.infer<typeof RevenueResponseMockSchema>;

const { getMock } = useFetchMock<RevenueResponseMock>('/mock/widgets/revenue.json');

async function getMockData(request: IGetRevenueRequest) {
	await delay(500);

	const response = await getMock();

	return apiSchema(RevenueHistorySchema).parse({
		ticker_id: request.tickerId,
		...response[request.mode],
	});
}
