import { type ISelectedFilter, ScreenerType } from '../model';
import type { ISort, TableRow } from '@/modules/cell';
import { getScreenerStock } from '../../stock/api';

interface IGetScreenerRequest {
	type: ScreenerType;
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

type Getter = (request: IGetScreenerRequest) => Promise<IPreparedResponse>;

const typeToGetter: Record<ScreenerType, Getter> = {
	[ScreenerType.Stock]: getScreenerStock,
	[ScreenerType.Crypto]: getScreenerStock,
	[ScreenerType.Bond]: getScreenerStock,
	[ScreenerType.DEX]: getScreenerStock,
	[ScreenerType.CEX]: getScreenerStock,
	[ScreenerType.ETF]: getScreenerStock,
};

export function useGetScreener(request: IGetScreenerRequest) {
	return typeToGetter[request.type](request);
}
