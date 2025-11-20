import { add, sub } from 'date-fns';
import { notNullish } from '@vueuse/core';

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { arrayToString } from '@/shared/lib';
import { DominanceDateRange, type IDominanceHistory } from '../model/dominance.ts';

const IS_USE_MOCK = true;

export interface IGetDominanceHistoryRequest {
	tickers: string[];
	range: DominanceDateRange;
}

export async function getDominanceHistory(args: IGetDominanceHistoryRequest): Promise<IDominanceHistory> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		return await httpService.get<IDominanceHistory>('/api/bitcoin-dominance/history', {
			query: {
				tickers: arrayToString(args.tickers),
				range: args.range,
			},
		});
	} catch (error) {
		logger.error('Failed to get dominance history', error as Error);
		throw error;
	}
}

const rangeDayCounts: Record<DominanceDateRange, number> = {
	[DominanceDateRange.Day]: 1,
	[DominanceDateRange.Week]: 7,
	[DominanceDateRange.Month]: 30,
	[DominanceDateRange.SixMonths]: 180,
	[DominanceDateRange.Year]: 365,
	[DominanceDateRange.All]: 365,
};

const tickerToSymbolMock: Record<string, string> = {
	'Crypto-BTC_Bitcoin': 'BTC',
	'Crypto-ETH_Ethereum': 'ETH',
	'Crypto-SOL_Solana': 'SOL',
};

const tickerDominanceMockStandard: Record<string, number> = {
	BTC: 50,
	ETH: 12,
	SOL: 2.8,
};

function createTickerDominanceMock(ticker: string) {
	const standard = tickerDominanceMockStandard[ticker];

	if (standard) {
		return standard + Math.random() * 10;
	}

	return Math.random() * 10;
}

async function getMockData(args: IGetDominanceHistoryRequest) {
	const daysCount = rangeDayCounts[args.range];
	const startDate = sub(new Date(), { days: daysCount + 10 }).getTime();
	const endDate = add(new Date(), { days: 1 }).getTime();
	const dateStep = (endDate - startDate) / 100;

	const normalizedTickers = args.tickers.filter(ticker => notNullish(tickerToSymbolMock[ticker]))
		.map(ticker => tickerToSymbolMock[ticker] ?? 'BTC');

	const points = Array.from({ length: 100 }).map((_, key) => ({
		timestamp: (new Date(startDate + key * dateStep)).toISOString(),
		dominance: Object.fromEntries(normalizedTickers.map(ticker => [ticker, createTickerDominanceMock(ticker)])),
	}));

	return {
		tickers: normalizedTickers,
		data: points,
		range: args.range,
	} as IDominanceHistory;
}
