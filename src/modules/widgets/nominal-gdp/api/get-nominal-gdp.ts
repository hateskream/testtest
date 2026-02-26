import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import {
	NOMINAL_GDP_METRIC,
	type NominalGdpDateRangePresetType,
	type NominalGdpHistory,
	NominalGdpHistorySchema,
} from '../model';
import { useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = false;

export interface IGetNominalGdpRequest {
	range: NominalGdpDateRangePresetType;
}

export const GetNominalGdpResponseSchema = NominalGdpHistorySchema.extend({
	metric: z.literal(NOMINAL_GDP_METRIC),
});

export type GetNominalGdpResponse = z.infer<typeof GetNominalGdpResponseSchema>;

export async function getNominalGdp(args: IGetNominalGdpRequest) {
	const client = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData(args);
		}

		const response = await client.get(
			'/api/v1/gdp/data',
			GetNominalGdpResponseSchema,
			{
				query: {
					metric: NOMINAL_GDP_METRIC,
					range: args.range,
				},
			});

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get Nominal GDP data', { error: error as Error });
		throw error;
	}
}

function prepareResponse(response: GetNominalGdpResponse): NominalGdpHistory {
	return {
		range: response.range,
		points: response.points,
	};
}

const { getMock } = useFetchMock<GetNominalGdpResponse>('/mock/widgets/gdp/nominal.json');

async function getMockData(_: IGetNominalGdpRequest) {
	await delay(500);

	const response = await getMock();

	return prepareResponse(response);
}

