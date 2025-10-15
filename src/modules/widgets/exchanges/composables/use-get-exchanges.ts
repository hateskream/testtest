import { MarketType } from '../model/exchanges';
import type { TableRow, ISort } from '@/modules/cell';
import { getExchangesCrypto } from '../api/get-crypto.ts';

interface IGetMarketRequest {
	market: MarketType;
	sort: ISort | null;
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
	[MarketType.CryptoCEX]: getExchangesCrypto,
	[MarketType.CryptoDEX]: getExchangesCrypto,
	[MarketType.Stock]: getExchangesCrypto,
};

export function useGetExchanges(req: IGetMarketRequest) {
	return marketToGetter[req.market](req);
}
