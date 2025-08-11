import { useHttpService } from '@/shared/service/http-service';
import { MarketType, type ITicker as ITickerDomain } from '../model';
import { useLogger } from '@/shared/service/logger';
import { arrayToString } from '@/shared/lib';
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
	market: MarketType;
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
	pinedTickers: ITicker[];
	pagination: IPagination;
}

export interface IGetPriceResponse {
	data: IData;
}

export interface IGetPricePreparedResponse {
	tickers: ITickerDomain[];
	pinedTickers: ITickerDomain[];
	pagination: IPagination;
}

export async function getPrice(req: IGetPriceRequest): Promise<IGetPricePreparedResponse> {
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
		tickers: prepareTickers(data.tickers),
		pinedTickers: prepareTickers(data.pinedTickers),
	};
}

function prepareTickers(tickers: ITicker[]) {
	return tickers
		.map(ticker => ({
			tickerId: ticker.tickerId,
			symbol: mapSymbol(ticker.symbol),
			priceCurrent: mapNumber(ticker.priceCurrent),
			changePrice24hPercent: mapPercent(ticker.changePrice24hPercent),
			price24hChart: mapSvgChart(ticker.price24hChart),
		}))
		.filter(isNotEmptyTicker) satisfies ITickerDomain[];
}

function isNotEmptyTicker(ticker: {
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
			return getMockData(req);
		case TypeSendRequest.MockServer:
			return httpService.get<IGetPriceResponse>('/api/price', {
				query,
			});
		default:
			return getMockData(req);
	}
}

const crypto: ITicker[] = [
	{
		tickerId: 'BTC 1',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'btc.png',
			ticker: 'BTC',
			blockchain: 'Bitcoin',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '86945.83',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.TRILLION,
		},
		changePrice24hPercent: {
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
	{
		tickerId: 'ETH 2',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'eth.png',
			ticker: 'ETH',
			blockchain: 'Ethereum',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '3456.78',
			trend: Trend.DOWN,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-2.31',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'BNB 3',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'bnb.png',
			ticker: 'BNB',
			blockchain: 'Binance',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '567.89',
			trend: Trend.UP,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '3.12',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'XRP 4',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'xrp.png',
			ticker: 'XRP',
			blockchain: 'Ripple',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.65',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.MILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.45',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'ADA 5',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'ada.png',
			ticker: 'ADA',
			blockchain: 'Cardano',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.92',
			trend: Trend.DOWN,
			currencySymbol: '$',
			magnitude: Magnitude.MILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-1.23',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'DOGE 6',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'doge.png',
			ticker: 'DOGE',
			blockchain: 'Dogecoin',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.08',
			trend: Trend.UP,
			currencySymbol: '$',
			magnitude: Magnitude.MILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '4.56',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'DOT 7',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'dot.png',
			ticker: 'DOT',
			blockchain: 'Polkadot',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '7.89',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.78',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'SOL 8',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'sol.png',
			ticker: 'SOL',
			blockchain: 'Solana',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '123.45',
			trend: Trend.DOWN,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-3.45',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'LTC 9',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'ltc.png',
			ticker: 'LTC',
			blockchain: 'Litecoin',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '89.01',
			trend: Trend.UP,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '2.34',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'MATIC 10',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'matic.png',
			ticker: 'MATIC',
			blockchain: 'Polygon',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '1.23',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.MILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.12',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
];

const stock: ITicker[] = [
	{
		tickerId: 'AAPL 1',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '1',
			ticker: 'AAPL',
			companyName: 'Apple',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '86945.83',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.TRILLION,
		},
		changePrice24hPercent: {
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
	{
		tickerId: 'MSFT 2',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '2',
			ticker: 'MSFT',
			companyName: 'Microsoft',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '72345.67',
			trend: Trend.DOWN,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.78',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'GOOGL 3',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '3',
			ticker: 'GOOGL',
			companyName: 'Alphabet',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '123456.78',
			trend: Trend.UP,
			currencySymbol: '$',
			magnitude: Magnitude.TRILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '2.34',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'AMZN 4',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '4',
			ticker: 'AMZN',
			companyName: 'Amazon',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '98765.43',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.00',
			trend: Trend.NEUTRAL,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'TSLA 5',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '5',
			ticker: 'TSLA',
			companyName: 'Tesla',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '45678.90',
			trend: Trend.DOWN,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-1.23',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'NVDA 6',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '6',
			ticker: 'NVDA',
			companyName: 'NVIDIA',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '34567.89',
			trend: Trend.UP,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '3.45',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'FB 7',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '7',
			ticker: 'FB',
			companyName: 'Meta',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '67890.12',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.56',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'NFLX 8',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '8',
			ticker: 'NFLX',
			companyName: 'Netflix',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '23456.78',
			trend: Trend.DOWN,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.98',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'ADBE 9',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '9',
			ticker: 'ADBE',
			companyName: 'Adobe',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '56789.01',
			trend: Trend.UP,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '1.89',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'PYPL 10',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '10',
			ticker: 'PYPL',
			companyName: 'PayPal',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '12345.67',
			trend: Trend.NEUTRAL,
			currencySymbol: '$',
			magnitude: Magnitude.BILLION,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.00',
			trend: Trend.NEUTRAL,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
];

const forex: ITicker[] = [
	{
		tickerId: 'USDEUR 1',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '1',
			leftSrcImg: '2',
			rightTicker: 'USD',
			leftTicker: 'EUR',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.9250',
			trend: Trend.UP,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.45',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'USDJPY 2',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '3',
			leftSrcImg: '4',
			rightTicker: 'USD',
			leftTicker: 'JPY',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '145.67',
			trend: Trend.DOWN,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.67',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'GBPUSD 3',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '5',
			leftSrcImg: '6',
			rightTicker: 'GBP',
			leftTicker: 'USD',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '1.2850',
			trend: Trend.NEUTRAL,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.00',
			trend: Trend.NEUTRAL,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'AUDUSD 4',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '7',
			leftSrcImg: '8',
			rightTicker: 'AUD',
			leftTicker: 'USD',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.6750',
			trend: Trend.DOWN,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.34',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'NZDUSD 5',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '9',
			leftSrcImg: '10',
			rightTicker: 'NZD',
			leftTicker: 'USD',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.6250',
			trend: Trend.UP,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.89',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'USDCAD 6',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '11',
			leftSrcImg: '12',
			rightTicker: 'USD',
			leftTicker: 'CAD',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '1.3450',
			trend: Trend.NEUTRAL,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.00',
			trend: Trend.NEUTRAL,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'USDCHF 7',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '13',
			leftSrcImg: '14',
			rightTicker: 'USD',
			leftTicker: 'CHF',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.9150',
			trend: Trend.UP,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.23',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'EURJPY 8',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '15',
			leftSrcImg: '16',
			rightTicker: 'EUR',
			leftTicker: 'JPY',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '158.76',
			trend: Trend.DOWN,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.56',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'EURGBP 9',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '17',
			leftSrcImg: '18',
			rightTicker: 'EUR',
			leftTicker: 'GBP',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '0.8750',
			trend: Trend.UP,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '0.78',
			trend: Trend.UP,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
	{
		tickerId: 'AUDJPY 10',
		symbol: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			rightSrcImg: '19',
			leftSrcImg: '20',
			rightTicker: 'AUD',
			leftTicker: 'JPY',
		},
		priceCurrent: {
			cellType: CellType.Number,
			columnType: ColumnType.PriceCurrent,
			value: '98.45',
			trend: Trend.DOWN,
			currencySymbol: '',
			magnitude: Magnitude.NONE,
		},
		changePrice24hPercent: {
			cellType: CellType.Percent,
			columnType: ColumnType.ChangePrice24hPercent,
			value: '-0.45',
			trend: Trend.DOWN,
		},
		price24hChart: {
			cellType: CellType.SvgChart,
			columnType: ColumnType.Price24hChart,
			src: '',
		},
	},
];

const marketToTickers: Record<MarketType, ITicker[]> = {
	[MarketType.Crypto]: crypto,
	[MarketType.Stock]: stock,
	[MarketType.Forex]: forex,
	[MarketType.Commodities]: [],
	[MarketType.Indices]: [],
};

async function getMockData(req: IGetPriceRequest): Promise<IGetPriceResponse> {

	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	const response: IGetPriceResponse = {
		data: {
			pagination: {
				offset: req.offset,
				limit: req.limit,
				total: 10,
			},
			tickers: marketToTickers[req.market].filter(t => !req.pined.includes(t.tickerId)),
			pinedTickers: marketToTickers[req.market].filter(t => req.pined.includes(t.tickerId)),
		},
	};

	return response;
}


