import { MarketType } from '@/modules/market';
import type { ISort, ISelectedFilter, TableRow } from '../model';
import { getMarketCrypto } from '../api';

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
	[MarketType.Stock]: getMarketCrypto,
	[MarketType.Forex]: getMarketCrypto,
	[MarketType.Commodities]: getMarketCrypto,
	[MarketType.Indices]: getMarketCrypto,
};

export function useGetMarket(req: IGetMarketRequest) {
	return marketToGetter[req.market](req);
}
