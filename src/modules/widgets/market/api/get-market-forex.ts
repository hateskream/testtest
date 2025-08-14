import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	type NumberDto,
	type PercentDto,
	type TextDto,
	ColumnType,
	mapSymbol,
	mapNumber,
	mapPercent,
	isEmptyCell,
	mapText,
	type SvgChartDto,
	mapSvgChart,
} from '@/modules/cell';
import type { MarketType } from '@/modules/market';
import type { ForexTableRow, ISelectedFilter, ISort } from '../model';
import { mockTickers } from './mock/forex';

const IS_USE_MOCK = true;

interface IGetMarketRequest {
	market: MarketType;
	sort: ISort | null;
	filters: ISelectedFilter[];
	limit: number;
	offset: number;
}

export interface ITicker {
	tickerId: string;
	[ColumnType.Symbol]: SymbolDto;
	[ColumnType.PriceCurrent]: NumberDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
	[ColumnType.Volume24h]: NumberDto;
	[ColumnType.PriceAvg50d]: NumberDto;
	// [ColumnType.Price1yRange]: RangeDto;
	[ColumnType.MarketCap24h]: NumberDto;
	[ColumnType.Beta5y]: NumberDto;
	[ColumnType.LastDividend]: NumberDto;
	[ColumnType.ChangePrice24h]: NumberDto;
	[ColumnType.VolumeAvg10d]: NumberDto;
	[ColumnType.Employees]: TextDto;
	[ColumnType.IpODate]: TextDto;
	[ColumnType.Sector]: TextDto;
	[ColumnType.Industry]: TextDto;
	[ColumnType.Source]: TextDto;
	[ColumnType.Price24hChart]: SvgChartDto;
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
	tickers: ForexTableRow[];
	pagination: IPagination;
}

export async function getMarketForex(_: IGetMarketRequest): Promise<IPreparedResponse> {
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
				[ColumnType.PriceAvg50d]: mapNumber(ticker[ColumnType.PriceAvg50d]),
				// [ColumnType.Price1yRange]: mapRange(ticker[ColumnType.Price1yRange]),
				[ColumnType.MarketCap24h]: mapNumber(ticker[ColumnType.MarketCap24h]),
				[ColumnType.Beta5y]: mapNumber(ticker[ColumnType.Beta5y]),
				[ColumnType.LastDividend]: mapNumber(ticker[ColumnType.LastDividend]),
				[ColumnType.ChangePrice24h]: mapNumber(ticker[ColumnType.ChangePrice24h]),
				[ColumnType.VolumeAvg10d]: mapNumber(ticker[ColumnType.VolumeAvg10d]),
				[ColumnType.Employees]: mapText(ticker[ColumnType.Employees]),
				[ColumnType.IpODate]: mapText(ticker[ColumnType.IpODate]),
				[ColumnType.Sector]: mapText(ticker[ColumnType.Sector]),
				[ColumnType.Industry]: mapText(ticker[ColumnType.Industry]),
				[ColumnType.Source]: mapText(ticker[ColumnType.Source]),
				[ColumnType.Price24hChart]: mapSvgChart(ticker[ColumnType.Price24hChart]),
			}))
			.filter(
				ticker =>
					Object
						.values(ticker)
						.map((maybeCell) => {
							if (typeof maybeCell === 'string') {
								return null;
							}
							return maybeCell;
						})
						.filter(el => el !== null)
						.every(cell => !isEmptyCell(cell)),
			) as ForexTableRow[],
		pagination,
	};
}

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
			tickers: mockTickers,
		},
	};

	return response;
}
