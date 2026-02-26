import { MarketType } from '@/modules/market';
import { SymbolType } from '@/modules/cell';
import { useFetchMock } from './fetch-mock';
import type { ITickerData } from './cell';

type AllTickersType = Record<SymbolType, ITickerData[]>;

const { getMock: getAllTickers } = useFetchMock<AllTickersType>('/mock/tickers/all-tickers.json');

export const MarketToSymbol = {
	[MarketType.Crypto]: SymbolType.Crypto,
	[MarketType.Stock]: SymbolType.Stock,
	[MarketType.Forex]: SymbolType.Forex,
	[MarketType.Commodities]: SymbolType.Commodity,
	[MarketType.Indices]: SymbolType.Index,
	[MarketType.Etf]: SymbolType.Etf,
};

export async function getTickersByMarketType(marketType: MarketType): Promise<ITickerData[]> {
	const allTickers = await getAllTickers();
	const symbolType = MarketToSymbol[marketType];
	return allTickers[symbolType] || [];
}

