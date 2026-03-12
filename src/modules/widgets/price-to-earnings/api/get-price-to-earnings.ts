import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { useApiClient } from '@/shared/service/api';
import { PriceToEarningsDataSchema } from '../model';

const IS_USE_MOCK = true;

export interface IGetPriceToEarningsRequest {
	tickerId: string;
}

export function getPriceToEarnings(request: IGetPriceToEarningsRequest) {
	const client = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData();
		}

		return client.get(
			'/api/v1/price-to-earnings/data',
			PriceToEarningsDataSchema,
			{
				query: {
					ticker_id: request.tickerId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get price to earnings data', {
			error: error as Error,
		});
		throw error;
	}
}

const { getMock } = useFetchMock<unknown>('/mock/widgets/price-to-earnings.json');

async function getMockData() {
	await delay(500);

	const response = await getMock();

	return PriceToEarningsDataSchema.parse(response);
}
