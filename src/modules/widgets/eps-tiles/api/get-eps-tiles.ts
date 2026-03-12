import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { EpsTilesDataSchema, type EpsTilesData } from '../model';

const IS_USE_MOCK = true;

export interface IGetEpsTilesRequest {
	tickerId: string;
}

const { getMock } = useFetchMock<EpsTilesData>('/mock/widgets/eps-tiles.json');

async function getMockData(_: IGetEpsTilesRequest) {
	await delay(2000);

	const response = await getMock();

	return EpsTilesDataSchema.parse(response);
}

export async function getEpsTiles(request: IGetEpsTilesRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData(request);
		}

		return apiClient.get('/api/v1/eps-tiles/data', EpsTilesDataSchema, {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get ticker EPS tiles', { error: error as Error });
		throw error;
	}
}
