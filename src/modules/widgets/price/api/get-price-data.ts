import { useHttpService } from '@/shared/service/http-service';
import { type FiltersState, type ITicker as ITickerDomain, type TickerWithoutState } from '../model';
import { useLogger } from '@/shared/service/logger';
import {
	ColumnType,
	type ColumnWithoutSymbol,
	mapTickersToTableRows,
	type NumberDto,
	type PercentDto,
	type SvgChartDto,
	type SymbolDto,
	SymbolType,
} from '@/modules/cell';
import { generateRows } from '@/shared/mock';
import { delay } from '@/shared/lib/delay.ts';
import { MarketType } from '@/modules/market';

const IS_USE_MOCK = true;

interface IGetPriceRequest {
	market: MarketType;
	pined: string[];
	offset: number;
	limit: number;
	filters: FiltersState;
}

interface ITicker {
	tickerId: string;
	symbol: SymbolDto;
	priceCurrent: NumberDto;
	changePrice24hPercent: PercentDto;
	price24hChart: SvgChartDto;
}

interface IPagination {
	total: number;
	offset: number;
	limit: number;
}

interface IData {
	tickers: ITicker[];
	pinedTickers: ITicker[];
	pagination: IPagination;
}

export interface IGetPriceResponse {
	data: IData;
}

export interface IPriceData {
	tickers: ITickerDomain[];
	pinedTickers: ITickerDomain[];
	pagination: IPagination;
}

export async function getPrice(req: IGetPriceRequest): Promise<IPriceData> {
	const logger = useLogger();
	const httpService = useHttpService();

	try {
		if (IS_USE_MOCK) {
			return getMockData(req);
		}

		const response = await httpService.get<IGetPriceResponse>('/api/v1/price/data', {
			query: {
				market: req.market,
				pinnedIds: req.pined.length ? req.pined.join(',') : undefined,
				offset: req.offset,
				limit: req.limit,
				...req.filters,
			},
		});

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get price', error as Error);
		throw error;
	}
}

function prepareResponse({ data }: IGetPriceResponse): IPriceData {
	return {
		tickers: mapTickersToTableRows<ITickerDomain>(data.tickers),
		pinedTickers: mapTickersToTableRows<ITickerDomain>(data.pinedTickers),
		pagination: data.pagination,
	};
}

const columnTypes: ColumnWithoutSymbol[] = [
	ColumnType.PriceCurrent,
	ColumnType.ChangePrice24hPercent,
	ColumnType.Price24hChart,
];

async function getMockData(req: IGetPriceRequest): Promise<IPriceData> {
	await delay(1000);

	const [crypto, commodities, forex, indices, stocks] = await Promise.all([
		generateRows(SymbolType.Crypto, columnTypes),
		generateRows(SymbolType.Commodity, columnTypes),
		generateRows(SymbolType.Forex, columnTypes),
		generateRows(SymbolType.Index, columnTypes),
		generateRows(SymbolType.Stock, columnTypes),
	]);

	const marketToTickers = {
		[MarketType.Crypto]: crypto,
		[MarketType.Stock]: stocks,
		[MarketType.Forex]: forex,
		[MarketType.Indices]: indices,
		[MarketType.Commodities]: commodities,
	} as Record<MarketType, TickerWithoutState[]>;

	const response: IPriceData = {
		pagination: {
			offset: req.offset,
			limit: req.limit,
			total: 50,
		},
		tickers: marketToTickers[req.market]
			.filter(t => !req.pined.includes(t.tickerId))
			.map(t => ({
				...t,
				isPined: false,
				isShow: true,
			}))
			.slice(0, req.limit),
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


