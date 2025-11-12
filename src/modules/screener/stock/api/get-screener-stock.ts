import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	ColumnType,
	type ColumnWithoutSymbol,
	type ISort,
	type NumberDto,
	type PercentDto,
	prepareMarketResponse,
	type RangeDto,
	type SvgChartDto,
	type SymbolDto,
	SymbolType,
	type TableRowDto,
	type TextDto,
} from '@/modules/cell';
import { generateRows } from '@/shared/mock';
import { type ISelectedFilter, ScreenerType } from '../../base/model';
import type { StockTableRow } from '../model';
import { delay } from '@/shared/lib';

const IS_USE_MOCK = true;

interface IGetScreenerRequest {
	type: ScreenerType;
	sort: ISort | null;
	filters: ISelectedFilter[];
	limit: number;
	offset: number;
}

// TODO: Доработать по апи

export type StockScreenerDto = TableRowDto<{
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
	tickers: StockScreenerDto[];
	pagination: IPagination;
}
interface IGetMarketResponse {
	data: IData;
}

export interface IPreparedResponse {
	tickers: StockTableRow[];
	pagination: IPagination;
}

export async function getScreenerStock(_: IGetScreenerRequest): Promise<IPreparedResponse> {
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
	ColumnType.Price24hChart,
	ColumnType.Beta5y,
	ColumnType.ChangePrice24h,
	ColumnType.ChangePrice24hPercent,
	ColumnType.Volume24h,
	ColumnType.VolumeAvg50d,
	ColumnType.VolumeRel24h,
	ColumnType.VolumeRelAvg50d,
	ColumnType.PriceEarnings,
	ColumnType.MarketCap24h,
	ColumnType.EpsDil12mo,
	ColumnType.EpsDilAvg50d,
	ColumnType.EpsDilGrowth12mo,
	ColumnType.EpsDilGrowthAvg50d,
	ColumnType.DividendYield,
	ColumnType.LastDividend,
	ColumnType.Employees,
	ColumnType.IpODate,
	ColumnType.Sector,
	ColumnType.Industry,
	ColumnType.AnalystRating,
	ColumnType.Source,
];

async function getMockData(): Promise<IPreparedResponse> {
	await delay(500);

	return {
		pagination: {
			offset: 0,
			limit: 10,
			total: 10,
		},
		tickers: await generateRows(SymbolType.Stock, columnTypes, 12),
	};
}
