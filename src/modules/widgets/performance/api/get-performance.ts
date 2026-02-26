import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import {
	ColumnType,
	type ColumnWithoutSymbol,
	createTickerIdFromCell,
	mapTickersToTableRows,
	type PercentDto,
	type SymbolDto,
	SymbolType,
	type TableRowDto,
} from '@/modules/cell';
import type { PerformanceTableRow } from '../model/row';
import { generateRows } from '@/shared/mock';
import { MarketType } from '@/modules/market';
import type { TickerWithoutState } from '../../price/model';
import { Currency, type DateRange, Stock } from '../model';

const IS_USE_MOCK = false;

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
	dateRange: DateRange;
	stockFilter?: Stock;
	quoteCurrency?: Currency;
}

export async function getPerformance(args: IGetPerformanceRequest): Promise<IPerformanceData> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData(args);
		}

		const response = await httpService.get<IGetPerformanceResponse>('/api/v1/performance/data', {
			query: {
				market: args.market,
				dateRange: args.dateRange,
				limit: args.limit,
				offset: args.offset,
				stockFilter: args.stockFilter,
				quoteCurrency: args.quoteCurrency,
			},
		});

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get performance data', { error: error as Error });
		throw error;
	}
}


function remapForexSymbol(ticker: TickerDto): TickerDto {
	const { symbol } = ticker;

	if (symbol.symbolType === 'Forex' && 'ticker' in symbol) {
		const forexTicker = (symbol as Record<string, unknown>).ticker as string;
		const srcImg = (symbol as Record<string, unknown>).srcImg as string;
		const leftTicker = forexTicker.substring(0, 3);
		const rightTicker = forexTicker.substring(3, 6);

		return {
			...ticker,
			symbol: {
				cellType: symbol.cellType,
				columnType: symbol.columnType,
				symbolType: symbol.symbolType,
				leftSrcImg: srcImg,
				rightSrcImg: srcImg,
				leftTicker,
				rightTicker,
			} as SymbolDto,
		};
	}

	return ticker;
}

function prepareResponse({ data }: IGetPerformanceResponse): IPerformanceData {

	const tickers = data?.tickers ?? [];
	const pinedTickers = data?.pinedTickers ?? [];
	const pagination = data?.pagination ?? { total: 0, offset: 0, limit: 0 };


	const remappedTickers = tickers.map(remapForexSymbol);
	const remappedPinedTickers = pinedTickers.map(remapForexSymbol);
	const sortedTickers = remappedTickers.sort((a, b) => {
		const aValue = (a[ColumnType.ChangePrice24hPercent]?.value) || 0;
		const bValue = (b[ColumnType.ChangePrice24hPercent]?.value) || 0;
		return Number(bValue) - Number(aValue);
	});

	const mappedTickers = mapTickersToTableRows<PerformanceTableRow>(sortedTickers).map(ticker => ({
		...ticker,
		tickerId: createTickerIdFromCell(ticker.symbol),
	}));


	const mappedPinedTickers = mapTickersToTableRows<PerformanceTableRow>(remappedPinedTickers).map(ticker => ({
		...ticker,
		tickerId: createTickerIdFromCell(ticker.symbol),
	}));

	return {
		tickers: mappedTickers,
		pinedTickers: mappedPinedTickers,
		pagination,
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
