import { useHttpService } from '@/shared/service/http-service';
import { delay } from '@/shared/lib';
import { useLogger } from '@/shared/service/logger';
import type { IKeyIndicator } from '../model/key-indicators';

const IS_USE_MOCK = true;

export interface IKeyIndicatorResponse {
	indicators: IKeyIndicator[];
	summarized: string;
}

export interface IKeyIndicatorRequest {
	ticker_id: string;
}

export function getKeyIndicators(request: IKeyIndicatorRequest): Promise<IKeyIndicatorResponse> {
	return IS_USE_MOCK ? getKeyIndicatorsMock() : getKeyIndicatorsApi(request);
}

async function getKeyIndicatorsMock(): Promise<IKeyIndicatorResponse> {
	await delay(1000);

	return {
		indicators: [
			{
				status: 'negative',
				label: 'Trading at +0.74% premium to NAV',
			},
			{
				status: 'positive',
				label: '$1.43B net inflows in the last month',
			},
			{
				status: 'positive',
				label: 'Outperforming S&P 500 by 2.16% YTD',
			},
			{
				status: 'positive',
				label: 'Top holding subtracted 0.01% to YTD returns',
			},
		],
		summarized: 'Summarized at 19:30',
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
