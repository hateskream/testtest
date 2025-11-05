import { sub } from 'date-fns';

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { arrayToString } from '@/shared/lib';
import { type IMarketCapHistory, type IMarketCapTicker, MarketCapDateRange } from '../model/market-cap';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = true;

export interface IGetMarketCapRequest {
	tickers: string[];
	range: MarketCapDateRange;
}

export async function getMarketCap(args: IGetMarketCapRequest): Promise<IMarketCapHistory> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		return await httpService.get<IMarketCapHistory>('/api/market', {
			query: {
				tickers: arrayToString(args.tickers),
				range: args.range,
			},
		});
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

const { getMock } = useFetchMock<IMarketCapTicker[]>('/mock/widgets/market-cap.json');

const rangeDayCounts: Record<MarketCapDateRange, number> = {
	[MarketCapDateRange.Day]: 1,
	[MarketCapDateRange.Week]: 7,
	[MarketCapDateRange.Month]: 30,
	[MarketCapDateRange.SixMonths]: 180,
	[MarketCapDateRange.Year]: 365,
	[MarketCapDateRange.All]: 365,
};

function generateTickerValue(from: number, to: number) {
	return from + Math.random() * (to - from);
}

function createTickerMock(range: MarketCapDateRange) {
	const daysCount = rangeDayCounts[range];

	const startDate = sub(new Date(), { days: daysCount + 10 });
	const endDate = Date.now();

	const dateStep = (endDate - startDate.getTime()) / 100;

	const timestamps = Array.from({ length: 100 }).map(
		(_, key) => (new Date(startDate.getTime() + key * dateStep)).getTime(),
	);

	return {
		prices: timestamps.map(time => [time, generateTickerValue(1_000, 3_000)]),
		market_caps: timestamps.map(time => [time, generateTickerValue(1_000_000_000_000, 1_100_100_000_000)]),
		volumes: timestamps.map(time => [time, generateTickerValue(1_000_000_000_000, 2_000_000_000_000)]),
	};
}

async function getMockData(args: IGetMarketCapRequest) {
	const tickers = await getMock();

	const filteredTickers = tickers.filter(ticker => args.tickers.includes(ticker.id));

	const data = Object.fromEntries(filteredTickers.map(ticker => [ticker.symbol, createTickerMock(args.range)]));

	return {
		tickers: filteredTickers,
		data,
	} as IMarketCapHistory;
}

