import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { TradingVolumeSchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';

const IS_USE_MOCK = true;

export interface ITradingVolumeRequest {
	tickerId: string;
}

export async function getTradingVolume(request: ITradingVolumeRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData();
		}

		return apiClient.get('/api/v1/trading-volume/data', apiSchema(TradingVolumeSchema), {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get trading volume', { error: error as Error });
		throw error;
	}
}

const { getMock } = useFetchMock('/mock/widgets/trading-volume.json');

async function getMockData() {
	await delay(2000);

	const response = await getMock();

	return TradingVolumeSchema.parse(response);
}
