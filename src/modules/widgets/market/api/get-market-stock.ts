import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	type NumberDto,
	type PercentDto,
	type TextDto,
	type RangeDto,
	type SvgChartDto,
	ColumnType,
	prepareMarketResponse,
	type TableRowDto,
	type ISort,
	SymbolType,
	type ColumnWithoutSymbol,
} from '@/modules/cell';
import type { MarketType } from '@/modules/market';
import type { ISelectedFilter } from '../model';
import type { StockTableRow } from '../model/stock';
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
	[ColumnType.Price1yRange]: RangeDto;
	[ColumnType.MarketCap24h]: NumberDto;
	[ColumnType.Beta5y]: NumberDto;
	[ColumnType.LastDividend]: NumberDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
	[ColumnType.ChangePrice24h]: NumberDto;
	[ColumnType.Volume24h]: NumberDto;
	[ColumnType.VolumeAvg50d]: NumberDto;
	[ColumnType.Employees]: TextDto;
	[ColumnType.IpODate]: TextDto;
	[ColumnType.Industry]: TextDto;
	[ColumnType.Sector]: TextDto;
	[ColumnType.Source]: TextDto;
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
	tickers: StockTableRow[];
	pagination: IPagination;
}

export async function getMarketStock(_: IGetMarketRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData();
		}

		const response = await httpService.get<IGetMarketResponse>('/api/market');

		return prepareMarketResponse<StockTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

const columnTypes: ColumnWithoutSymbol[] = [
	ColumnType.PriceCurrent,
	ColumnType.Price1yRange,
	ColumnType.MarketCap24h,
	ColumnType.Beta5y,
	ColumnType.LastDividend,
	ColumnType.ChangePrice24hPercent,
	ColumnType.ChangePrice24h,
	ColumnType.Volume24h,
	ColumnType.VolumeAvg50d,
	ColumnType.Employees,
	ColumnType.IpODate,
	ColumnType.Industry,
	ColumnType.Sector,
	ColumnType.Source,
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
		tickers: await generateRows(SymbolType.Stock, columnTypes, 12),
	};

	return response;
}
