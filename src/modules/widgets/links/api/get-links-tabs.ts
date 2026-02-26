import { useLogger } from '@/shared/service/monitoring';
import { delay } from '@/shared/lib';
import { LinksSchema } from '../model';
import { apiSchema, useApiClient } from '@/shared/service/api';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = false;

export interface ILinksTabsRequest {
	ticker_id: string;
}

export function getLinksTabs(request: ILinksTabsRequest) {
	return IS_USE_MOCK ? getMockLinksTabs() : getApiLinksTabs(request);
}

async function getApiLinksTabs(request: ILinksTabsRequest) {
	const http = useApiClient();

	try {
		return http.get('/api/v1/links/data', apiSchema(LinksSchema), {
			query: {
				ticker_id: request.ticker_id,
			},
		});
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to get ticker links', { error: error as Error });
		throw error;
	}
}

const { getMock } = useFetchMock('/mock/widgets/links.json');

async function getMockLinksTabs() {
	await delay(1000);

	const response = await getMock();

	return apiSchema(LinksSchema).parse(response);
}
