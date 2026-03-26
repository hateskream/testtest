import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { useApiClient } from '@/shared/service/api';
import { CompanyHeadquartersSchema } from '../model';

const IS_USE_MOCK = true;

export interface ICompanyHeadquartersRequest {
	ticker_id: string;
}

export function getCompanyHeadquarters(request: ICompanyHeadquartersRequest) {
	return IS_USE_MOCK ? getMockData() : getApiData(request);
}

async function getApiData(request: ICompanyHeadquartersRequest) {
	const apiClient = useApiClient();
	const logger = useLogger();

	try {
		return apiClient.get('/api/v1/company-headquarters/data', CompanyHeadquartersSchema, {
			query: {
				ticker_id: request.ticker_id,
			},
		});
	} catch (error) {
		logger.error('Failed to get company headquarters', { error: error as Error });
		throw error;
	}
}

const { getMock } = useFetchMock('/mock/widgets/company-headquarters.json');

async function getMockData() {
	await delay(2500);

	const response = await getMock();

	return CompanyHeadquartersSchema.parse(response);
}
