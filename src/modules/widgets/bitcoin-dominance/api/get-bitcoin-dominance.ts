import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	ColumnType,
	type TableRowDto,
	type ColorDto,
	mapTickersToTableRows,
	type PercentDto,
} from '@/modules/cell';
import { mockTickers } from './mock';
import type { TickerTableRow } from '../model';

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
	tickers: TickerTableRow[];
}

export async function getBitcoinDominance(query: IGetRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData(query)
			: await httpService.get<IGetResponse>('/api/bitcoin-dominance', {
				query: {
					tickerIds: query.tickersIds,
				},
			});

		return {
			tickers: mapTickersToTableRows<TickerTableRow>(response.data.tickers),
		};
	} catch (error) {
		logger.error('Failed to get bitcoin-dominance', error as Error);
		throw error;
	}
}


async function getMockData(query: IGetRequest): Promise<IGetResponse> {
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
