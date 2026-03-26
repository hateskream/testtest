import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { EarningsPerShareDataSchema } from '../model';

const IS_USE_MOCK = true;

export interface IGetEarningsPerShareRequest {
	tickerId: string;
}

export async function getEarningsPerShare(request: IGetEarningsPerShareRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return await apiClient.get(
			'/api/v1/earnings-per-share/data',
			apiSchema(EarningsPerShareDataSchema),
			{
				query: {
					ticker_id: request.tickerId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get earnings per share data', {
			error: error as Error,
		});
		throw error;
	}
}

const EarningsPerShareMockResponseSchema = EarningsPerShareDataSchema.omit({ tickerId: true });

type EarningsPerShareMockResponse = z.infer<typeof EarningsPerShareMockResponseSchema>;

const { getMock } = useFetchMock<EarningsPerShareMockResponse>('/mock/widgets/earnings-per-share.json');

async function getMockData(request: IGetEarningsPerShareRequest) {
	await delay(500);
	const response = await getMock();

	return apiSchema(EarningsPerShareDataSchema).parse({
		tickerId: request.tickerId,
		...response,
	});
}
