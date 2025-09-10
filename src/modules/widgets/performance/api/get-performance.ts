import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { removeUndefinedPropertiesFromObject } from '@/shared/lib';
import {
	ColumnType,
	prepareMarketResponse,
	SymbolType,
	type PercentDto,
	type SymbolDto,
	type TableRowDto,
} from '@/modules/cell';
import type { PerformanceTableRow } from '../model/row';
import type { DateRange, Stock } from '../model';
import { generateRows } from '@/shared/mock';

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

export interface IGetPerformanceRequest {
	stock?: Stock;
	date?: DateRange;
	offset: number;
	limit: number;
}

export async function getPerformance(args: IGetPerformanceRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		if (IS_USE_MOCK) {
			return getMockData(args);
		}

		const response = await httpService.get<IGetPerformanceResponse>('/api/market', {
			query,
		});

		return prepareMarketResponse<PerformanceTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get performance data', error as Error);
		throw error;
	}
}

async function getMockData(_: IGetPerformanceRequest): Promise<IPreparedResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	return {
		tickers: generateRows(SymbolType.PlaneText, [ColumnType.ChangePrice24hPercent]),
		pagination: {
			offset: 0,
			limit: 10,
			total: 10,
		},
	};
}
