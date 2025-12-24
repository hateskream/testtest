import { isValid } from 'date-fns';

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IFederalFundsDomain } from '../model';

const IS_USE_MOCK = false;

export interface IGetFederalFundsRequest {
	widgetId: string;
}

export async function getFederalFunds(request: IGetFederalFundsRequest): Promise<IFederalFundsDomain> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		let response;

		if (IS_USE_MOCK) {
			response = await getMockData();
		} else {
			response = await httpService.get<IFederalFundsDomain>('/api/v1/federal-funds/data', {
				query: {
					widgetId: request.widgetId,
				},
			});
		}

		validateResponse(response);

		return response;
	} catch (error) {
		logger.error('Failed to get Federal Funds data', error as Error);
		throw error;
	}
}

function validateResponse(response: IFederalFundsDomain) {
	const date = new Date(response.next_review_date);

	if (!isValid(date)) {
		throw new Error('Invalid next review date');
	}
}

const { getMock } = useFetchMock<IFederalFundsDomain>('/mock/widgets/federal-funds.json');

async function getMockData() {
	await delay(500);

	return await getMock();
}

