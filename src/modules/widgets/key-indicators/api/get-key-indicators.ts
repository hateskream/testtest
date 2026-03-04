import { delay } from '@/shared/lib';
import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';
import { KeyIndicatorsResponseSchema, type IKeyIndicatorsResponse } from '../model/key-indicators';

const IS_USE_MOCK = false;

export interface IKeyIndicatorRequest {
	ticker_id: string;
}

export function getKeyIndicators(request: IKeyIndicatorRequest): Promise<IKeyIndicatorsResponse> {
	return IS_USE_MOCK ? getKeyIndicatorsMock() : getKeyIndicatorsApi(request);
}

async function getKeyIndicatorsMock(): Promise<IKeyIndicatorsResponse> {
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
		summarized: 'Today at 17:39',
		summarized_date: '2026-02-04T12:30:37Z',
	};
}

async function getKeyIndicatorsApi(request: IKeyIndicatorRequest) {
	const client = useApiClient();
	const logger = useLogger();

	try {
		return await client.get(
			'/api/v1/key-indicators/data',
			KeyIndicatorsResponseSchema,
			{
				query: {
					ticker_id: request.ticker_id,
				},
			},
		);
	} catch (error) {
		logger.error('Error fetching key indicators', { error: error as Error });
		throw error;
	}
}
