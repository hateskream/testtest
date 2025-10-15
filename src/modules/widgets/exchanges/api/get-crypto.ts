import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	ColumnType,
	prepareMarketResponse,
	type TableRowDto,
	type ISort,
	SymbolType,
	type ColumnWithoutSymbol,
} from '@/modules/cell';
import type { CryptoCEXTableRow, CryptoDEXTableRow } from '../model';
import { type MarketType } from '../model/exchanges';
import { generateRows } from '@/shared/mock';

const IS_USE_MOCK = true;

interface IGetMarketRequest {
	market: MarketType;
	sort: ISort | null;
	limit: number;
	offset: number;
}

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
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
	tickers: CryptoCEXTableRow[] | CryptoDEXTableRow[];
	pagination: IPagination;
}

export async function getExchangesCrypto(_: IGetMarketRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData();
		}

		const response = await httpService.get<IGetMarketResponse>('/api/exchanges');

		return prepareMarketResponse<CryptoCEXTableRow | CryptoDEXTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}


async function getMockData(): Promise<IPreparedResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const columnTypes: ColumnWithoutSymbol[] = [
		ColumnType.Volume24h,
		ColumnType.PriceCurrent,
		ColumnType.MaxSupply,
	];

	const response: IPreparedResponse = {
		pagination: {
			offset: 0,
			limit: 10,
			total: 10,
		},
		tickers: await generateRows(SymbolType.Crypto, columnTypes, 12),
	};

	return response;
}
