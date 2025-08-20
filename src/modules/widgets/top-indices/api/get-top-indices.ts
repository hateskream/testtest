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
	CellType,
	Status,
	Trend,
	Magnitude,
} from '@/modules/cell';
import type { TopIndicesTableRow } from '../model';

const IS_USE_MOCK = true;

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

export async function getTopIndicesCrypto(_: IGetTopIndicesRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetTopIndicesResponse>('/api/top-indices', {
				query: {

				},
			});

		return prepareMarketResponse<TopIndicesTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get top indices', error as Error);
		throw error;
	}
}

const tickers: TickerDto[] = [
	{
		tickerId: '1',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '/flags/spain.png',
			indexName: 'Spain',
			ticker: 'Spain',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '1.00',
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.ChangePrice24h,
			value: '+38.0',
			currencySymbol: '$',
			magnitude: Magnitude.NONE,
			trend: Trend.UP,
		},
		[ColumnType.Volatility]: {
			cellType: CellType.Label,
			columnType: ColumnType.Volatility,
			value: 'volatile',
			status: Status.CAUTION,
		},
	},
	{
		tickerId: '2',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '/flags/germany.png',
			indexName: 'Germany',
			ticker: 'Germany',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '2.50',
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.ChangePrice24h,
			value: '+45.2',
			currencySymbol: '$',
			magnitude: Magnitude.NONE,
			trend: Trend.UP,
		},
		[ColumnType.Volatility]: {
			cellType: CellType.Label,
			columnType: ColumnType.Volatility,
			value: 'buy',
			status: Status.POSITIVE,
		},
	},
	{
		tickerId: '3',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '/flags/germany.png',
			indexName: 'Italy',
			ticker: 'Italy',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.75',
			trend: Trend.DOWN,
		},
		[ColumnType.ChangePrice24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.ChangePrice24h,
			value: '-12.3',
			currencySymbol: '$',
			magnitude: Magnitude.NONE,
			trend: Trend.DOWN,
		},
		[ColumnType.Volatility]: {
			cellType: CellType.Label,
			columnType: ColumnType.Volatility,
			value: 'sell',
			status: Status.NEGATIVE,
		},
	},
	{
		tickerId: '4',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '/flags/germany.png',
			indexName: 'Brazil',
			ticker: 'Brazil',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.00',
			trend: Trend.NEUTRAL,
		},
		[ColumnType.ChangePrice24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.ChangePrice24h,
			value: '0.0',
			currencySymbol: '$',
			magnitude: Magnitude.NONE,
			trend: Trend.NEUTRAL,
		},
		[ColumnType.Volatility]: {
			cellType: CellType.Label,
			columnType: ColumnType.Volatility,
			value: 'neutral',
			status: Status.NEUTRAL,
		},
	},
	{
		tickerId: '5',
		[ColumnType.Symbol]: {
			columnType: ColumnType.Symbol,
			cellType: CellType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '/flags/germany.png',
			indexName: 'Sweden',
			ticker: 'Sweden',
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '3.25',
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.ChangePrice24h,
			value: '+67.8',
			currencySymbol: '$',
			magnitude: Magnitude.NONE,
			trend: Trend.UP,
		},
		[ColumnType.Volatility]: {
			cellType: CellType.Label,
			columnType: ColumnType.Volatility,
			value: 'sale',
			status: Status.POSITIVE,
		},
	},
];

async function getMockData(): Promise<IGetTopIndicesResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: IGetTopIndicesResponse = {
		data: {
			pagination: {
				offset: 0,
				limit: 10,
				total: 10,
			},
			tickers,
		},
	};

	return response;
}
