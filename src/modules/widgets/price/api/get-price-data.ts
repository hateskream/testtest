import { useHttpService } from '@/shared/service/http-service';
import { type ITicker as ITickerDomain } from '../model';
import { useLogger } from '@/shared/service/logger';
import { arrayToString, generateTimestampId } from '@/shared/lib';
import {
	CellType,
	ColumnType,
	isEmptyCell,
	Magnitude,
	mapNumber,
	mapPercent,
	mapSvgChart,
	mapSymbol,
	SymbolType,
	Trend,
	type IEmptyCell,
	type INumberCell,
	type IPercentCell,
	type ISvgChartCell,
	type ISymbolCell,
	type NumberDto,
	type PercentDto,
	type SvgChartDto,
	type SymbolDto,
} from '@/modules/cell';

enum TypeSendRequest {
	Prod,
	MockLocal,
	MockServer,
}

const typeSendRequest = TypeSendRequest.MockLocal;

interface IGetPriceRequest {
	market: string;
	pined: string[];
	offset: number;
	limit: number;
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
	// pinedTickers: ITicker[];
	pagination: IPagination;
}

export interface IGetPriceResponse {
	data: IData;
}

export interface IGetPricePreparedResponse {
	tickers: ITickerDomain[];
	pagination: IPagination;
}

export async function getPrice(req: IGetPriceRequest): Promise<IGetPricePreparedResponse | null> {
	const logger = useLogger();

	try {
		const response = await senderRequestByType(typeSendRequest, req);

		return prepare(response);
	} catch (error) {
		logger.error('Failed to get price', error as Error);
		throw error;
	}
}

function prepare({ data }: IGetPriceResponse): IGetPricePreparedResponse {
	return {
		pagination: data.pagination,
		tickers: data.tickers
			.map(ticker => ({
				tickerId: ticker.tickerId,
				symbol: mapSymbol(ticker.symbol),
				priceCurrent: mapNumber(ticker.priceCurrent),
				changePrice24hPercent: mapPercent(ticker.changePrice24hPercent),
				price24hChart: mapSvgChart(ticker.price24hChart),
			}))
			.filter(isNotEmptyTicker),
	};
}

function isNotEmptyTicker(ticker: {
	tickerId: string;
	symbol: ISymbolCell | IEmptyCell;
	priceCurrent: INumberCell | IEmptyCell;
	changePrice24hPercent: IPercentCell | IEmptyCell;
	price24hChart: ISvgChartCell | IEmptyCell;
}): ticker is ITickerDomain {
	return (
		!isEmptyCell(ticker.symbol) &&
		!isEmptyCell(ticker.priceCurrent) &&
		!isEmptyCell(ticker.changePrice24hPercent) &&
		!isEmptyCell(ticker.price24hChart)
	);
}

function senderRequestByType(
	type: TypeSendRequest,
	req: IGetPriceRequest,
): Promise<IGetPriceResponse> {
	const httpService = useHttpService();

	const query = {
		market: req.market,
		pined: arrayToString(req.pined),
		offset: req.offset,
		limit: req.limit,
	};

	switch (type) {
		case TypeSendRequest.Prod:
			return httpService.get<IGetPriceResponse>('https://gateway.planet9.uk/price', {
				query,
			});
		case TypeSendRequest.MockLocal:
			return getMockData(req.offset, req.limit);
		case TypeSendRequest.MockServer:
			return httpService.get<IGetPriceResponse>('/api/price', {
				query,
			});
		default:
			return getMockData(req.offset, req.limit);
	}
}

async function getMockData(offset: number, limit: number): Promise<IGetPriceResponse> {
	const allMockData: ITicker[] = [
		{
			tickerId: generateTimestampId(),
			symbol:  {
				cellType: CellType.Symbol,
				columnType: ColumnType.Symbol,
				symbolType: SymbolType.Crypto,
				srcImg: '1',
				ticker: 'BTC',
				blockchain: 'Bitcoin',
			},
			priceCurrent:  {
				cellType: CellType.Number,
				columnType: ColumnType.PriceCurrent,
				value: '86945.83',
				trend: Trend.NEUTRAL,
				currencySymbol: '$',
				magnitude: Magnitude.TRILLION,
			},
			changePrice24hPercent:   {
				cellType: CellType.Percent,
				columnType: ColumnType.ChangePrice24hPercent,
				value: '1.54',
				trend: Trend.UP,
			},
			price24hChart: {
				cellType: CellType.SvgChart,
				columnType: ColumnType.Price24hChart,
				src: '',
			},
		},
	];

	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	const response: IGetPriceResponse = {
		data: {
			pagination: {
				offset: offset,
				limit: limit,
				total: 100,
			},
			tickers: allMockData,
		},
	};

	return response;
}
