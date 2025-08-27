import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { type Ticker } from '../model';
import { arrayToString } from '@/shared/lib';
import {
	SymbolType,
	Magnitude,
	Trend,
	CellType,
	ColumnType,
	type TableRowDto,
	type SymbolDto,
	type NumberDto,
	mapTickersToTableRows,
} from '@/modules/cell';

const IS_USE_MOCK = true;

export interface IGetWatchlistRequest {
	tickerIds: string[];
}

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.PriceCurrent]: NumberDto;
}>;

export interface IGetWatchlistResponse {
	data: {
		tickers: TickerDto[];
	};
}

export async function getTickers({ tickerIds }: IGetWatchlistRequest): Promise<Ticker[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData(tickerIds)
			: await httpService.get<IGetWatchlistResponse>('/api/v1/watchlist/', {
				query: {
					tickers: arrayToString(tickerIds),
				},
			});

		return mapTickersToTableRows<Ticker>(response.data.tickers);
	} catch (error) {
		logger.error('Failed to get watchlist', error as Error);
		throw error;
	}
}

async function getMockData(_: string[]): Promise<IGetWatchlistResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const tickers: Ticker[] = [
		{
			tickerId: 'BTC',
			[ColumnType.Symbol]: {
				cellType: CellType.Symbol,
				columnType: ColumnType.Symbol,
				symbolType: SymbolType.Stock,
				srcImg: '1',
				ticker: 'TSLA 1',
				companyName: 'Tesla,Inc. 1',
			},
			[ColumnType.PriceCurrent]: {
				cellType: CellType.Number,
				columnType: ColumnType.PriceCurrent,
				value: '182.24',
				currencySymbol: '$',
				magnitude: Magnitude.NONE,
				trend: Trend.UP,
			},
		},
		{
			tickerId: 'ETH',
			[ColumnType.Symbol]: {
				cellType: CellType.Symbol,
				columnType: ColumnType.Symbol,
				symbolType: SymbolType.Stock,
				srcImg: '1',
				ticker: 'TSLA 2',
				companyName: 'Tesla,Inc. 2',
			},
			[ColumnType.PriceCurrent]: {
				cellType: CellType.Number,
				columnType: ColumnType.PriceCurrent,
				value: '182.24',
				currencySymbol: '$',
				magnitude: Magnitude.NONE,
				trend: Trend.UP,
			},
		},
		{
			tickerId: 'USDT',
			[ColumnType.Symbol]: {
				cellType: CellType.Symbol,
				columnType: ColumnType.Symbol,
				symbolType: SymbolType.Stock,
				srcImg: '1',
				ticker: 'TSLA 3',
				companyName: 'Tesla,Inc. 3',
			},
			[ColumnType.PriceCurrent]: {
				cellType: CellType.Number,
				columnType: ColumnType.PriceCurrent,
				value: '182.24',
				currencySymbol: '$',
				magnitude: Magnitude.NONE,
				trend: Trend.UP,
			},
		},
		{
			tickerId: 'BNB',
			[ColumnType.Symbol]: {
				cellType: CellType.Symbol,
				columnType: ColumnType.Symbol,
				symbolType: SymbolType.Stock,
				srcImg: '1',
				ticker: 'TSLA 4',
				companyName: 'Tesla,Inc. 4',
			},
			[ColumnType.PriceCurrent]: {
				cellType: CellType.Number,
				columnType: ColumnType.PriceCurrent,
				value: '182.24',
				currencySymbol: '$',
				magnitude: Magnitude.NONE,
				trend: Trend.UP,
			},
		},
	];

	const response: IGetWatchlistResponse = {
		data: {
			tickers,
		},
	};
	return response;
}
