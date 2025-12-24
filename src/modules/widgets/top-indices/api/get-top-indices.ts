import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	type NumberDto,
	type PercentDto,
	type LabelDto,
	ColumnType,
	prepareMarketResponse,
	type TableRowDto,
	SymbolType,
	type ColumnWithoutSymbol,
} from '@/modules/cell';
import type { TopIndicesTableRow } from '../model';
import { generateRows } from '@/shared/mock';

const IS_USE_MOCK = false;

interface IGetTopIndicesRequest {
	limit: number;
	offset: number;
}

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
	[ColumnType.ChangePrice24h]: NumberDto;
	[ColumnType.Volatility]: LabelDto;
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
interface IGetTopIndicesResponse {
	data: IData;
}

export interface IPreparedResponse {
	tickers: TopIndicesTableRow[];
	pagination: IPagination;
}

export async function getTopIndicesCrypto(req: IGetTopIndicesRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData(req);
		}

		const response = await httpService.get<IGetTopIndicesResponse>('/api/v1/top_indices_ytd/data', {
			query: {
				limit: req.limit,
				offset: req.offset,
			},
		});

		return prepareMarketResponse<TopIndicesTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get top indices', error as Error);
		throw error;
	}
}

const columnTypes: ColumnWithoutSymbol[] = [
	ColumnType.ChangePrice24hPercent,
	ColumnType.ChangePrice24h,
	ColumnType.Volatility,
];

async function getMockData(req: IGetTopIndicesRequest): Promise<IPreparedResponse> {
	const tickers: TopIndicesTableRow[] = await generateRows(SymbolType.Index, columnTypes);

	return {
		pagination: {
			offset: 0,
			limit: req.limit,
			total: req.limit,
		},
		tickers: tickers.slice(0, req.limit),
	};
}
