import { MarketType } from '@/modules/market';
import type { ISelectedFilter } from '../model';
import type { TableRow, ISort } from '@/modules/cell';
import { getMarketCommodities, getMarketCrypto, getMarketForex, getMarketIndices, getMarketStock } from '../api';

interface IGetMarketRequest {
	market: MarketType;
	sort: ISort | null;
	filters: ISelectedFilter[];
	limit: number;
	offset: number;
}

interface IPagination {
	total: number;
	offset: number;
	limit: number;
}

export interface IPreparedResponse {
	tickers: TableRow[];
	pagination: IPagination;
}

type Getter = (req: IGetMarketRequest) => Promise<IPreparedResponse>;


const marketToGetter: Record<MarketType, Getter> = {
	[MarketType.Crypto]: getMarketCrypto,
	[MarketType.Stock]: getMarketStock,
	[MarketType.Forex]: getMarketForex,
	[MarketType.Commodities]: getMarketCommodities,
	[MarketType.Indices]: getMarketIndices,
};

export function useGetMarket(req: IGetMarketRequest) {
	return marketToGetter[req.market](req);
}
