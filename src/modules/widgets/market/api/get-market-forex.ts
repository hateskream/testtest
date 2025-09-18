import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	type NumberDto,
	type PercentDto,
	type TextDto,
	type SvgChartDto,
	ColumnType,
	prepareMarketResponse,
	type TableRowDto,
	type ISort,
	SymbolType,
	type ColumnWithoutSymbol,
} from '@/modules/cell';
import type { MarketType } from '@/modules/market';
import type { ForexTableRow, ISelectedFilter } from '../model';
import { generateRows } from '@/shared/mock';

const IS_USE_MOCK = true;

interface IGetMarketRequest {
	market: MarketType;
	sort: ISort | null;
	filters: ISelectedFilter[];
	limit: number;
	offset: number;
}

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.PriceCurrent]: NumberDto;
	[ColumnType.ChangePrice24h]: NumberDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
	[ColumnType.Volume24h]: NumberDto;
	[ColumnType.PriceMin24h]: NumberDto;
	[ColumnType.PriceMax24h]: NumberDto;
	[ColumnType.PriceMin1y]: NumberDto;
	[ColumnType.PriceMax1y]: NumberDto;
	[ColumnType.PriceAvg50d]: NumberDto;
	[ColumnType.PriceAvg200d]: NumberDto;
	[ColumnType.PriceOpen]: NumberDto;
	[ColumnType.PriceClose]: NumberDto;
	[ColumnType.UpdateDate]: TextDto;
	[ColumnType.Price24hChart]: SvgChartDto;
}>;

interface IPagination {
	total: number;
	offset: number;
	limit: number;
}

interface IData {
	tickers: TickerDto[];
	pagination: IPagination;
}
interface IGetMarketResponse {
	data: IData;
}

export interface IPreparedResponse {
	tickers: ForexTableRow[];
	pagination: IPagination;
}

export async function getMarketForex(_: IGetMarketRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData();
		}

		const response = await httpService.get<IGetMarketResponse>('/api/market');

		return prepareMarketResponse<ForexTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

const columnTypes: ColumnWithoutSymbol[] = [
	ColumnType.PriceCurrent,
	ColumnType.ChangePrice24h,
	ColumnType.ChangePrice24hPercent,
	ColumnType.Volume24h,
	ColumnType.PriceMin24h,
	ColumnType.PriceMax24h,
	ColumnType.PriceMin1y,
	ColumnType.PriceMax1y,
	ColumnType.PriceAvg50d,
	ColumnType.PriceAvg200d,
	ColumnType.PriceOpen,
	ColumnType.PriceClose,
	ColumnType.UpdateDate,
	ColumnType.Price24hChart,
];

async function getMockData(): Promise<IPreparedResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 500);
	});

	const response: IPreparedResponse = {

		pagination: {
			offset: 0,
			limit: 10,
			total: 10,
		},
		tickers: generateRows(SymbolType.Forex, columnTypes, 12),
	};

	return response;
}

