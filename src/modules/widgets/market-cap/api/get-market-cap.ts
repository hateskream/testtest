import { add, sub } from 'date-fns';

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { arrayToString } from '@/shared/lib';
import {
	type IMarketCapHistory,
	type IMarketCapMarket,
	type IMarketCapPoint,
	type IMarketCapTicker,
	type IMarketCapTotal,
	MarketCapDateRange,
} from '../model';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = false;

export interface IGetMarketCapRequest {
	tickers: string[];
	markets: string[];
	range: MarketCapDateRange;
}

export interface IGetMarketCapResponse {
	tickers: IMarketCapTicker[];
	markets: IMarketCapMarket[];
	range: MarketCapDateRange;
	data: {
		points: IMarketCapPoint<string>[];
		total: IMarketCapTotal;
	};
}

export async function getMarketCap(args: IGetMarketCapRequest): Promise<IMarketCapHistory> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		const response = await httpService.get<IGetMarketCapResponse>('/api/v1/market-cap/data', {
			query: {
				tickerIDs: args.tickers.length ? arrayToString(args.tickers) : undefined,
				markets: args.markets.length ? arrayToString(args.markets) : undefined,
				range: args.range,
			},
		});

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get market', { error: error as Error });
		throw error;
	}
}

function prepareResponse(history: IGetMarketCapResponse) {
	return {
		tickers: history.tickers,
		markets: history.markets,
		range: history.range,
		data: {
			points: history.data.points.map(point => ({
				timestamp: Date.parse(point.timestamp),
				marketCap: point.marketCap,
				volume: point.volume,
			})),
			total: history.data.total,
		},
	};
}

interface IMarketCapMockData {
	tickers: IMarketCapTicker[];
	markets: IMarketCapMarket[];
}

const { getMock } = useFetchMock<IMarketCapMockData>('/mock/widgets/market-cap.json');

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

function createPointsMock(args: IGetMarketCapRequest) {
	const daysCount = rangeDayCounts[args.range];

	const startDate = sub(new Date(), { days: daysCount + 10 }).getTime();
	const endDate = add(new Date(), { days: 1 }).getTime();

	const dateStep = (endDate - startDate) / 100;

	const timestamps = Array.from({ length: 100 }).map(
		(_, key) => (new Date(startDate + key * dateStep)).getTime(),
	);

	function generateSegment(from: number, to: number) {
		return Object.fromEntries([
			...args.tickers.map(value => [value, generateTickerValue(from, to)]),
			...args.markets.map(value => [value, generateTickerValue(from, to)]),
		]);
	}

	return timestamps.map(time => {
		return {
			timestamp: time,
			marketCap: generateSegment(1_000_000_000_000, 1_100_100_000_000),
			volume: generateSegment(1_000_000_000_000, 2_000_000_000_000),
		};
	});
}

function createTotalMock(args: IGetMarketCapRequest) {
	function generateSegment(from: number, to: number) {
		return Object.fromEntries([
			...args.tickers.map(value => [value, generateTickerValue(from, to)]),
			...args.markets.map(value => [value, generateTickerValue(from, to)]),
		]);
	}

	return {
		marketCap: generateSegment(1_000_000_000_000, 1_100_100_000_000),
		volume: generateSegment(1_000_000_000_000, 2_000_000_000_000),
		changePercent: generateSegment(-5, 5),
	};

}

async function getMockData(args: IGetMarketCapRequest) {
	const { tickers, markets } = await getMock();

	const filteredTickers = tickers.filter(ticker => args.tickers.includes(ticker.id));
	const filteredMarkets = markets.filter(market => args.markets.includes(market.id));

	const data = {
		points: createPointsMock(args),
		total: createTotalMock(args),
	};

	return {
		range: args.range,
		tickers: filteredTickers,
		markets: filteredMarkets,
		data,
	} as IMarketCapHistory;
}

