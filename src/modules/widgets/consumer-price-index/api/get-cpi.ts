import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { type CpiDateRangePresetType, type CpiHistoryPoint, CpiHistorySchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = false;

export interface IGetCpiRequest {
	range: CpiDateRangePresetType;
}

export async function getCpi(args: IGetCpiRequest) {
	const httpService = useApiClient();
	const logger = useLogger();

	const schema = apiSchema(CpiHistorySchema);

	try {
		if (IS_USE_MOCK) {
			const response = await getMockData(args);
			return schema.parse(response);
		}

		return httpService.get(
			'/api/v1/cpi/data',
			schema,
			{
				query: {
					range: args.range,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get CPI data', { error: error as Error });
		throw error;
	}
}

interface ICpiHistoryMock {
	range: CpiDateRangePresetType;
	points: CpiHistoryPoint[];
	growth_yoy: number;
}

const { getMock } = useFetchMock<ICpiHistoryMock>('/mock/widgets/cpi.json');

async function getMockData(args: IGetCpiRequest) {
	await delay(500);

	const response = await getMock();

	return {
		...response,
		range: args.range,
	};
}

