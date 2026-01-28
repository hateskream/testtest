import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IUSInflationDomain } from '../model';

const IS_USE_MOCK = false;

export interface IGetUsInflationRequest {
	widgetId: string;
}

export async function getUsInflation(request: IGetUsInflationRequest): Promise<IUSInflationDomain> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData();
		}

		return await httpService.get<IUSInflationDomain>('/api/v1/us-inflation/data', {
			query: {
				widgetId: request.widgetId,
			},
		});
	} catch (error) {
		logger.error('Failed to get CPI data', { error: error as Error });
		throw error;
	}
}

const { getMock } = useFetchMock<IUSInflationDomain>('/mock/widgets/us-inflation.json');

async function getMockData() {
	await delay(500);

	return await getMock();
}

