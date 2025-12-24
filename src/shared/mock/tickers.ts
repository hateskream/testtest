import { MarketType } from '@/modules/market';
import { SymbolType } from '@/modules/cell';
import { useFetchMock } from './fetch-mock';
import type { ITickerData } from './cell';
import { MarketToSymbol } from '@/modules/ticker-selector/model';

type AllTickersType = Record<SymbolType, ITickerData[]>;

const { getMock: getAllTickers } = useFetchMock<AllTickersType>('/mock/tickers/all-tickers.json');

export async function getTickersByMarketType(marketType: MarketType): Promise<ITickerData[]> {
	const allTickers = await getAllTickers();
	const symbolType = MarketToSymbol[marketType];
	return allTickers[symbolType] || [];
}

