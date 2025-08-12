import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { removeUndefinedPropertiesFromObject } from '@/shared/lib';
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

const IS_USE_MOCK = true;

export interface IGetMarketRequest {
	market: string;
	sort?: string;
}

interface ITicker {
	tickerId: string;
	symbol: SymbolDto;
	priceCurrent: NumberDto;
	changePrice24hPercent: PercentDto;
	volume24h: NumberDto;
	marketCap: NumberDto;
	listingDate: TextDto;
}

export interface IGetMarketResponse {
	data: ITicker[];
}

export interface IMarketDomain {
	tickerId: string;
	symbol: ISymbolCell;
	priceCurrent: INumberCell;
	changePrice24hPercent: IPercentCell;
	volume24h: INumberCell;
	marketCap: INumberCell;
	listingDate: ITextCell;
}

export async function getMarket(args: IGetMarketRequest): Promise<IMarketDomain[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetMarketResponse>('/api/market', {
				query,
			});

		return prepareResponse(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

function prepareResponse(tickers: ITicker[]): IMarketDomain[] {
	return tickers
		.map(ticker => ({
			tickerId: ticker.tickerId,
			symbol: mapSymbol(ticker.symbol),
			priceCurrent: mapNumber(ticker.priceCurrent),
			changePrice24hPercent: mapPercent(ticker.changePrice24hPercent),
			volume24h: mapNumber(ticker.volume24h),
			marketCap: mapNumber(ticker.marketCap),
			listingDate: mapText(ticker.listingDate),
		}))
		.filter(isNotEmptyTicker) satisfies IMarketDomain[];
}

function isNotEmptyTicker(ticker: {
	symbol: ISymbolCell | IEmptyCell;
	priceCurrent: INumberCell | IEmptyCell;
	changePrice24hPercent: IPercentCell | IEmptyCell;
	volume24h: INumberCell | IEmptyCell;
	marketCap: INumberCell | IEmptyCell;
	listingDate: ITextCell | IEmptyCell;
}): ticker is IMarketDomain {
	return (
		!isEmptyCell(ticker.symbol) &&
		!isEmptyCell(ticker.priceCurrent) &&
		!isEmptyCell(ticker.changePrice24hPercent) &&
		!isEmptyCell(ticker.volume24h) &&
		!isEmptyCell(ticker.marketCap) &&
		!isEmptyCell(ticker.listingDate)
	);
}

const mockData: ITicker[] = [
	{
		tickerId: '1',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'ADA',
			blockchain: 'Example Blockchain',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0',
			trend: Trend.NEUTRAL,
		},
		volume24h: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		marketCap: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		listingDate: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '2',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0',
			trend: Trend.NEUTRAL,
		},
		volume24h: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		marketCap: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		listingDate: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '3',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0',
			trend: Trend.NEUTRAL,
		},
		volume24h: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		marketCap: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		listingDate: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '4',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.3',
			trend: Trend.UP,
		},
		volume24h: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		marketCap: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		listingDate: {
			cellType: CellType.Text,
			columnType: ColumnType.ListingDate,
			value: new Date('2024-04-30').toString(),
		},
	},
	{
		tickerId: '5',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: '1',
			ticker: 'BNB',
			blockchain: 'Example Blockchain',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '137.4',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '1',
			trend: Trend.NEUTRAL,
		},
		volume24h: {
			cellType: CellType.Number,
			columnType: ColumnType.Volume24h,
			value: '11723737.43',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		marketCap: {
			cellType: CellType.Number,
			columnType: ColumnType.MarketCap24h,
			value: '22737283.45',
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
			trend: Trend.UP,
		},
		listingDate: {
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
		data: mockData,
	};

	return response;
}
