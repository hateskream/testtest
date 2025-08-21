import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { removeUndefinedPropertiesFromObject } from '@/shared/lib';
import type { IGetPerformanceRequest } from '../model';
import {
	CellType,
	ColumnType,
	prepareMarketResponse,
	SymbolType,
	Trend,
	type PercentDto,
	type SymbolDto,
	type TableRowDto,
} from '@/modules/cell';
import type { PerformanceTableRow } from '../model/row';

const IS_USE_MOCK = true;

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
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
interface IGetPerformanceResponse {
	data: IData;
}

export interface IPreparedResponse {
	tickers: PerformanceTableRow[];
	pagination: IPagination;
}

export async function getPerformance(args: IGetPerformanceRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData(args)
			: await httpService.get<IGetPerformanceResponse>('/widgets/performance', {
				query,
			});
		return prepareMarketResponse<PerformanceTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get performance data', error as Error);
		throw error;
	}
}

const tickers: TickerDto[] = [
	{
		tickerId: '1',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Media & Entertainment',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-1.08',
			maxAbsValue: 56,
			trend: Trend.DOWN,
		},
	},
	{
		tickerId: '2',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Communication Equipment',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '16.13',
			maxAbsValue: 82,
			trend: Trend.UP,
		},
	},
	{
		tickerId: '3',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Technology Distributors',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '13.66',
			maxAbsValue: 47,
			trend: Trend.UP,
		},
	},
	{
		tickerId: '4',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Consumer Electronics',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '7.68',
			maxAbsValue: 31,
			trend: Trend.UP,
		},
	},
	{
		tickerId: '5',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Renewable Utilities',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.44',
			maxAbsValue: 78,
			trend: Trend.UP,
		},
	},
	{
		tickerId: '6',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Regulated Water',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.33',
			maxAbsValue: 63,
			trend: Trend.UP,
		},
	},
	{
		tickerId: '7',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Regulated Gas',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.86',
			maxAbsValue: 29,
			trend: Trend.DOWN,
		},
	},
	{
		tickerId: '8',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Regulated Electric',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-1.43',
			maxAbsValue: 44,
			trend: Trend.DOWN,
		},
	},
	{
		tickerId: '9',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Independent Power Producers',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-1.78',
			maxAbsValue: 71,
			trend: Trend.DOWN,
		},
	},
	{
		tickerId: '10',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'Diversified Utilities',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-8.43',
			maxAbsValue: 59,
			trend: Trend.DOWN,
		},
	},
	{
		tickerId: '11',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.PlaneText,
			text: 'General Utilities',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-17.33',
			maxAbsValue: 85,
			trend: Trend.DOWN,
		},
	},
];

async function getMockData(_: IGetPerformanceRequest): Promise<IGetPerformanceResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	return {
		data: {
			tickers,
			pagination: {
				offset: 0,
				limit: 10,
				total: 10,
			},
		},
	};
}
