import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { getTickerIdMarket, type TickerMarket } from '@/modules/ticker';
import type { ActivityMetricsResponse, IActivityMetricsRequest } from './contract.ts';

type ActivityMetricsResponseMock = Record<TickerMarket, Omit<ActivityMetricsResponse, 'ticker_id'>>;

const { getMock } = useFetchMock<ActivityMetricsResponseMock>('/mock/widgets/activity-metrics.json');

export async function getMockData(request: IActivityMetricsRequest) {
	await delay(2000);

	const tickers = await getMock();
	const market = getTickerIdMarket(request.tickerId);

	return {
		ticker_id: request.tickerId as string,
		...tickers[market],
	} as ActivityMetricsResponse;
}
