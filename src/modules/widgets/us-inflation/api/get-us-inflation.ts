import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';

const IS_USE_MOCK = false;

export interface IGetUsInflationRequest {
	widgetId: string;
}

const YoYChangeSchema = z.object({
	value: z.number(),
	direction: z.enum(['up', 'down']),
});

const USInflationPointSchema = z.object({
	label: z.string(),
	value: z.number(),
});

export const GetUsInflationResponseSchema = z.object({
	current_value: z.number(),
	yoy_change: YoYChangeSchema,
	chart: z.array(USInflationPointSchema),
});

export type GetUsInflationResponse = z.infer<typeof GetUsInflationResponseSchema>;

export async function getUsInflation(request: IGetUsInflationRequest): Promise<GetUsInflationResponse> {
	const client = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData();
		}

		return await client.get('/api/v1/us-inflation/data', GetUsInflationResponseSchema, {
			query: {
				widgetId: request.widgetId,
			},
		});
	} catch (error) {
		logger.error('Failed to get US inflation data', { error: error as Error });
		throw error;
	}
}

const { getMock } = useFetchMock<GetUsInflationResponse>('/mock/widgets/us-inflation.json');

async function getMockData() {
	await delay(500);

	return await getMock();
}
