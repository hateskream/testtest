import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { REAL_GDP_METRIC, type RealGdpDateRangePresetType, type RealGdpHistory, RealGdpHistorySchema } from '../model';
import { useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = false;

export interface IGetRealGdpRequest {
	range: RealGdpDateRangePresetType;
}

export const GetRealGdpResponseSchema = RealGdpHistorySchema.extend({
	metric: z.literal(REAL_GDP_METRIC),
});

export type GetRealGdpResponse = z.infer<typeof GetRealGdpResponseSchema>;

export async function getRealGdp(args: IGetRealGdpRequest) {
	const client = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		const response = await client.get(
			'/api/v1/gdp/data',
			GetRealGdpResponseSchema,
			{
				query: {
					metric: REAL_GDP_METRIC,
					range: args.range,
				},
			},
		);

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get Real GDP data', { error: error as Error });
		throw error;
	}
}

function prepareResponse(response: GetRealGdpResponse): RealGdpHistory {
	return {
		range: response.range,
		points: response.points,
	};
}

const { getMock } = useFetchMock<GetRealGdpResponse>('/mock/widgets/gdp/real.json');

async function getMockData(_: IGetRealGdpRequest) {
	await delay(500);

	const response = await getMock();

	return prepareResponse(response);
}

