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
} from '@/modules/cell';
import { mockTickers } from './mock';
import type { TickerTableRow } from '../model/market-cap';

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
	tickers: TickerTableRow[];
}

export async function getMarketCap(query: IMarketCapRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData(query)
			: await httpService.get<IGetResponse>('/api/market-cap', {
				query: {
					tickerIds: query.tickersIds,
				},
			});

		return {
			tickers: mapTickersToTableRows<TickerTableRow>(response.data.tickers),
		};
	} catch (error) {
		logger.error('Failed to get market-cap', error as Error);
		throw error;
	}
}


async function getMockData(query: IMarketCapRequest): Promise<IGetResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const tickers = query.tickersIds.split(',');

	return {
		data:{
			tickers: mockTickers.filter((item) => tickers.includes(item.tickerId)),
		},
	};
}
