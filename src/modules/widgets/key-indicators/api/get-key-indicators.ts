import { useHttpService } from '@/shared/service/http-service';
import type { IKeyIndicatorRequest, IKeyIndicatorResponse } from '../model/contract';
import { delay } from '@/shared/lib';
import { useLogger } from '@/shared/service/logger';

const IS_USE_MOCK = true;

export function getKeyIndicators(request: IKeyIndicatorRequest): Promise<IKeyIndicatorResponse> {
	return IS_USE_MOCK ? getKeyIndicatorsMock() : getKeyIndicatorsApi(request);
}

async function getKeyIndicatorsMock(): Promise<IKeyIndicatorResponse> {
	await delay(1000);

	return {
		indicators: [
			{
				status: 'positive',
				label: 'Label 1',
			},
			{
				status: 'negative',
				label: 'Label 2',
			},
		],
	};
}

function getKeyIndicatorsApi(request: IKeyIndicatorRequest) {
	const https = useHttpService();

	try {
		return https.get<IKeyIndicatorResponse>('/key-indicators', {
			query: {
				ticker_id: request.ticker_id,
			},
		});
	} catch (error) {
		const logger = useLogger();
		logger.debug('Error fetching key indicators');
		throw error;
	}
}
