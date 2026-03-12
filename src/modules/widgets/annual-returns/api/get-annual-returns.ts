import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { useApiClient } from '@/shared/service/api';
import { AnnualReturnsDataSchema } from '../model';

const IS_USE_MOCK = true;

export interface IGetAnnualReturnsRequest {
	tickerId: string;
}

export function getAnnualReturns(request: IGetAnnualReturnsRequest) {
	const client = useApiClient();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData();
		}

		return client.get(
			'/api/v1/annual-returns/data',
			AnnualReturnsDataSchema,
			{
				query: {
					ticker_id: request.tickerId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get annual returns data', {
			error: error as Error,
		});
		throw error;
	}
}

const { getMock } = useFetchMock<unknown>('/mock/widgets/annual-returns.json');

async function getMockData() {
	await delay(2500);

	const response = await getMock();

	return AnnualReturnsDataSchema.parse(response);
}
