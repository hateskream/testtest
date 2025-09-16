import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	ColumnType,
	type TableRowDto,
	type NumberDto,
	type ColorDto,
	mapTickersToTableRows,
	type PercentDto,
	SymbolType,
	type ColumnWithoutSymbol,
} from '@/modules/cell';
import type { TickerRow } from '../model/market-cap';
import { generateRows } from '@/shared/mock';

const IS_USE_MOCK = true;

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.Color]: ColorDto;
	[ColumnType.MarketCap24h]: NumberDto;
	[ColumnType.MarketCapChange24hPercent]: PercentDto;
}>;

export interface IMarketCapRequest {
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

export async function getMarketCap(query: IMarketCapRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(query);
		}

		const response = await httpService.get<IGetResponse>('/api/market-cap', {
			query: {
				tickerIds: query.tickersIds,
			},
		});

		return {
			tickers: mapTickersToTableRows<TickerRow>(response.data.tickers),
		};
	} catch (error) {
		logger.error('Failed to get market-cap', error as Error);
		throw error;
	}
}


const columnTypes: ColumnWithoutSymbol[] = [
	ColumnType.Color,
	ColumnType.MarketCapChange24hPercent,
	ColumnType.MarketCap24h,
];

const mockTickers = [
	...generateRows<TickerRow>(SymbolType.Crypto, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Commodity, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Forex, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Index, columnTypes, 20),
	...generateRows<TickerRow>(SymbolType.Stock, columnTypes, 20),
];


async function getMockData(query: IMarketCapRequest): Promise<IPreparedResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const tickers = query.tickersIds.split(',');

	return {
		tickers: mockTickers.filter((item) => tickers.includes(item.tickerId)),
	};
}
