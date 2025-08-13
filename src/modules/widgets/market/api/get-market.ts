import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	type NumberDto,
	type PercentDto,
	type TextDto,
	CellType,
	ColumnType,
	SymbolType,
	Trend,
	type ISymbolCell,
	type INumberCell,
	type IPercentCell,
	type ITextCell,
	Magnitude,
	mapSymbol,
	mapNumber,
	mapPercent,
	type IEmptyCell,
	isEmptyCell,
	mapText,
} from '@/modules/cell';
import type { CryptoTableRow } from '../model/crypto';
import type { MarketType } from '@/modules/market';
import type { ISelectedFilter, ISort } from '../model';

const IS_USE_MOCK = true;

interface IGetMarketRequest {
	market: MarketType;
	sort: ISort | null;
	filters: ISelectedFilter[];
	limit: number;
	offset: number;
}

interface ITicker {
	tickerId: string;
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.PriceCurrent]: NumberDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
	[ColumnType.Volume24h]: NumberDto;
	[ColumnType.MarketCap24h]: NumberDto;
	[ColumnType.ListingDate]: TextDto;
}

interface IPagination {
	total: number;
	offset: number;
	limit: number;
}

interface IData {
	tickers: ITicker[];
	pagination: IPagination;
}
interface IGetMarketResponse {
	data: IData;
}

export interface IPreparedResponse {
	tickers: CryptoTableRow[];
	pagination: IPagination;
}

export async function getMarketCrypto(_: IGetMarketRequest): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetMarketResponse>('/api/market', {
				query: {

				},
			});

		return prepareResponse(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

function prepareResponse({ tickers, pagination }: IData): IPreparedResponse {
	return {
		tickers: tickers
			.map(ticker => ({
				tickerId: ticker.tickerId,
				[ColumnType.Symbol]: mapSymbol(ticker[ColumnType.Symbol]),
				[ColumnType.PriceCurrent]: mapNumber(ticker[ColumnType.PriceCurrent]),
				[ColumnType.ChangePrice24hPercent]: mapPercent(ticker[ColumnType.ChangePrice24hPercent]),
				[ColumnType.Volume24h]: mapNumber(ticker[ColumnType.Volume24h]),
				[ColumnType.MarketCap24h]: mapNumber(ticker[ColumnType.MarketCap24h]),
				[ColumnType.ListingDate]: mapText(ticker[ColumnType.ListingDate]),
			}))
			.filter(isNotEmptyTicker) satisfies CryptoTableRow[],
		pagination,
	};
}

function isNotEmptyTicker(ticker: {
	[ColumnType.Symbol]: ISymbolCell | IEmptyCell;
	[ColumnType.PriceCurrent]: INumberCell | IEmptyCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell | IEmptyCell;
	[ColumnType.Volume24h]: INumberCell | IEmptyCell;
	[ColumnType.MarketCap24h]: INumberCell | IEmptyCell;
	[ColumnType.ListingDate]: ITextCell | IEmptyCell;
}): ticker is CryptoTableRow {
	return (
		!isEmptyCell(ticker[ColumnType.Symbol]) &&
		!isEmptyCell(ticker[ColumnType.PriceCurrent]) &&
		!isEmptyCell(ticker[ColumnType.ChangePrice24hPercent]) &&
		!isEmptyCell(ticker[ColumnType.Volume24h]) &&
		!isEmptyCell(ticker[ColumnType.MarketCap24h]) &&
		!isEmptyCell(ticker[ColumnType.ListingDate])
	);
}

const mockData: ITicker[] = [
	{
		tickerId: '1',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'ADA',
			blockchain: 'Example Blockchain',
		},
		[ColumnType.PriceCurrent]: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0',
			trend: Trend.NEUTRAL,
		},
		[ColumnType.Volume24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.MarketCap24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ListingDate]: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '2',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		[ColumnType.PriceCurrent]: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0',
			trend: Trend.NEUTRAL,
		},
		[ColumnType.Volume24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.MarketCap24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ListingDate]: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '3',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		[ColumnType.PriceCurrent]: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0',
			trend: Trend.NEUTRAL,
		},
		[ColumnType.Volume24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.MarketCap24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ListingDate]: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '4',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		[ColumnType.PriceCurrent]: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.3',
			trend: Trend.UP,
		},
		[ColumnType.Volume24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.MarketCap24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ListingDate]: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '5',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		[ColumnType.PriceCurrent]: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ChangePrice24hPercent]: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '1',
			trend: Trend.NEUTRAL,
		},
		[ColumnType.Volume24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.MarketCap24h]: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		[ColumnType.ListingDate]: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
];

async function getMockData(): Promise<IGetMarketResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: IGetMarketResponse = {
		data: {
			pagination: {
				offset: 0,
				limit: 10,
				total: 10,
			},
			tickers: mockData,
		},
	};

	return response;
}
