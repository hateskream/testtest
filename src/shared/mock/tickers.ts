import { MarketType } from '@/modules/market';
import { SymbolType } from '@/modules/cell';
import { useFetchMock } from './fetch-mock';
import type { ITickerData } from './cell';

type AllTickersType = Record<SymbolType, ITickerData[]>;

const { getMock: getAllTickers } = useFetchMock<AllTickersType>('/mock/tickers/all-tickers.json');

const marketTypeToSymbolType: Record<MarketType, SymbolType> = {
	[MarketType.Crypto]: SymbolType.Crypto,
	[MarketType.Stock]: SymbolType.Stock,
	[MarketType.Forex]: SymbolType.Forex,
	[MarketType.Commodities]: SymbolType.Commodity,
	[MarketType.Indices]: SymbolType.Index,
};

export async function getTickersByMarketType(marketType: MarketType): Promise<ITickerData[]> {
	const allTickers = await getAllTickers();
	const symbolType = marketTypeToSymbolType[marketType];
	return allTickers[symbolType] || [];
}

