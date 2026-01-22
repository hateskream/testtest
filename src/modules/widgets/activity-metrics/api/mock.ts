import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { ActivityMetricsResponse, IActivityMetricsRequest } from './contract.ts';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import type { MarketType } from '@/modules/market';

type ActivityMetricsResponseMock = {
	[K in MarketType]: Omit<ActivityMetricsResponse<K>, 'ticker_id'>;
};

const { getMock } = useFetchMock<ActivityMetricsResponseMock>('/mock/widgets/activity-metrics.json');

export async function getMockData<TMarket extends MarketType>(
	request: IActivityMetricsRequest<TMarket>,
) {
	await delay(2000);

	const tickers = await getMock();
	const market = resolveMarketTypeFromTicker(request.tickerId)!;

	return {
		ticker_id: request.tickerId,
		...tickers[market],
	} as ActivityMetricsResponse<TMarket>;
}
