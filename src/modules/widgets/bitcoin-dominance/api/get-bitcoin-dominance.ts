import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	ColumnType,
	type TableRowDto,
	type ColorDto,
	mapTickersToTableRows,
	type PercentDto,
	type ColumnWithoutSymbol,
	SymbolType,
} from '@/modules/cell';
import type { TickerRow } from '../model';
import { generateRows } from '@/shared/mock';

const IS_USE_MOCK = true;

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.Color]: ColorDto;
	[ColumnType.Dominance24hPercent]: PercentDto;
	[ColumnType.Dominance7dPercent]: PercentDto;
	[ColumnType.Dominance30dPercent]: PercentDto;
}>;

export interface IGetRequest {
	tickersIds: string;
}

interface IGetResponse {
	data: {
		tickers: TickerDto[];
	};
}

export interface IPreparedResponse {
	tickers: TickerRow[];
}

export async function getBitcoinDominance(query: IGetRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {

		if (IS_USE_MOCK) {
			return await getMockData(query);
		}

		const response = await httpService.get<IGetResponse>('/api/bitcoin-dominance', {
			query: {
				tickerIds: query.tickersIds,
			},
		});

		return {
			tickers: mapTickersToTableRows<TickerRow>(response.data.tickers),
		};
	} catch (error) {
		logger.error('Failed to get bitcoin-dominance', error as Error);
		throw error;
	}
}


const columnTypes: ColumnWithoutSymbol[] = [
	ColumnType.Color,
	ColumnType.Dominance24hPercent,
	ColumnType.Dominance7dPercent,
	ColumnType.Dominance30dPercent,
];

const mockTickers = [
	...generateRows<TickerRow>(SymbolType.Crypto, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Commodity, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Forex, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Index, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Stock, columnTypes, 20),
];


async function getMockData(query: IGetRequest): Promise<IPreparedResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const tickers = query.tickersIds.split(',');

	return {
		tickers: mockTickers.filter((item) => tickers.includes(item.tickerId)),
	};
}
