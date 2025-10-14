import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	ColumnType,
	mapTickersToTableRows,
	SymbolType,
	type ColumnWithoutSymbol,
	type PercentDto,
	type SymbolDto,
	type TableRowDto,
} from '@/modules/cell';
import type { PerformanceTableRow } from '../model/row';
import { generateRows } from '@/shared/mock';
import { MarketType } from '@/modules/market';
import type { TickerWithoutState } from '../../price/model';

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
	pinedTickers: TickerDto[];
	pagination: IPagination;
}

interface IGetPerformanceResponse {
	data: IData;
}

export interface IPerformanceData {
	tickers: PerformanceTableRow[];
	pinedTickers: PerformanceTableRow[];
	pagination: IPagination;
}

export interface IGetPerformanceRequest {
	market: MarketType;
	pined: string[];
	offset: number;
	limit: number;
}

export async function getPerformance(args: IGetPerformanceRequest): Promise<IPerformanceData> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData(args);
		}

		const response = await httpService.get<IGetPerformanceResponse>('/api/market');

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get performance data', error as Error);
		throw error;
	}
}

function prepareResponse({ data }: IGetPerformanceResponse): IPerformanceData {
	return {
		tickers: mapTickersToTableRows<PerformanceTableRow>(data.tickers),
		pinedTickers: mapTickersToTableRows<PerformanceTableRow>(data.pinedTickers),
		pagination: data.pagination,
	};
}

const columnTypes: ColumnWithoutSymbol[] = [ColumnType.ChangePrice24hPercent];

async function getMockData(req: IGetPerformanceRequest): Promise<IPerformanceData> {
	const [forex, stocks] = await Promise.all([
		generateRows(SymbolType.Forex, columnTypes),
		generateRows(SymbolType.Stock, columnTypes),
	]);

	const marketToTickers = {
		[MarketType.Stock]: stocks,
		[MarketType.Forex]: forex,
	} as Record<MarketType, TickerWithoutState[]>;

	const response: IPerformanceData = {
		pagination: {
			offset: req.offset,
			limit: req.limit,
			total: 10,
		},
		tickers: marketToTickers[req.market]
			.filter(t => !req.pined.includes(t.tickerId))
			.map(t => ({
				...t,
				isPined: false,
				isShow: true,
			})),
		pinedTickers: marketToTickers[req.market]
			.filter(t => req.pined.includes(t.tickerId))
			.map(t => ({
				...t,
				isPined: true,
				isShow: true,
			})),
	};

	return response;
}
