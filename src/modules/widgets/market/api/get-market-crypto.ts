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
import type { CryptoTableRow } from '../model';
import type { MarketType } from '@/modules/market';
import type { ISelectedFilter, ISort } from '../model';
import { mockTickers } from './mock/crypto';

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
	[ColumnType.PriceMin24h]: NumberDto;
	[ColumnType.PriceMax24h]: NumberDto;
	[ColumnType.PriceMin1y]: NumberDto;
	[ColumnType.PriceMax1y]: NumberDto;
	[ColumnType.PriceAvg50d]: NumberDto;
	[ColumnType.PriceAvg200d]: NumberDto;
	[ColumnType.PriceOpen]: NumberDto;
	[ColumnType.PriceClose]: NumberDto;
	[ColumnType.AllTimeHigh]: NumberDto;
	[ColumnType.AllTimeHighChangePercent]: PercentDto;
	[ColumnType.AllTimeHighDate]: TextDto;
	[ColumnType.AllTimeLow]: NumberDto;
	[ColumnType.AllTimeLowChangePercent]: PercentDto;
	[ColumnType.AllTimeLowDate]: TextDto;
	[ColumnType.ChangePrice24h]: NumberDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
	[ColumnType.Volume24h]: NumberDto;
	[ColumnType.MarketCap24h]: NumberDto;
	[ColumnType.MarketCapRank]: TextDto;
	[ColumnType.MarketCapFullyDiluted]: NumberDto;
	[ColumnType.MarketCapChange24h]: NumberDto;
	[ColumnType.MarketCapChange24hPercent]: PercentDto;
	[ColumnType.CirculatingSupply]: NumberDto;
	[ColumnType.TotalSupply]: NumberDto;
	[ColumnType.MaxSupply]: NumberDto;
	[ColumnType.UpdateDate]: TextDto;
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
				[ColumnType.PriceMin24h]: mapNumber(ticker[ColumnType.PriceMin24h]),
				[ColumnType.PriceMax24h]: mapNumber(ticker[ColumnType.PriceMax24h]),
				[ColumnType.PriceMin1y]: mapNumber(ticker[ColumnType.PriceMin1y]),
				[ColumnType.PriceMax1y]: mapNumber(ticker[ColumnType.PriceMax1y]),
				[ColumnType.PriceAvg50d]: mapNumber(ticker[ColumnType.PriceAvg50d]),
				[ColumnType.PriceAvg200d]: mapNumber(ticker[ColumnType.PriceAvg200d]),
				[ColumnType.PriceOpen]: mapNumber(ticker[ColumnType.PriceOpen]),
				[ColumnType.PriceClose]: mapNumber(ticker[ColumnType.PriceClose]),
				[ColumnType.AllTimeHigh]: mapNumber(ticker[ColumnType.AllTimeHigh]),
				[ColumnType.AllTimeHighChangePercent]: mapPercent(ticker[ColumnType.AllTimeHighChangePercent]),
				[ColumnType.AllTimeHighDate]: mapText(ticker[ColumnType.AllTimeHighDate]),
				[ColumnType.AllTimeLow]: mapNumber(ticker[ColumnType.AllTimeLow]),
				[ColumnType.AllTimeLowChangePercent]: mapPercent(ticker[ColumnType.AllTimeLowChangePercent]),
				[ColumnType.AllTimeLowDate]: mapText(ticker[ColumnType.AllTimeLowDate]),
				[ColumnType.ChangePrice24h]: mapNumber(ticker[ColumnType.ChangePrice24h]),
				[ColumnType.ChangePrice24hPercent]: mapPercent(ticker[ColumnType.ChangePrice24hPercent]),
				[ColumnType.Volume24h]: mapNumber(ticker[ColumnType.Volume24h]),
				[ColumnType.MarketCap24h]: mapNumber(ticker[ColumnType.MarketCap24h]),
				[ColumnType.MarketCapRank]: mapText(ticker[ColumnType.MarketCapRank]),
				[ColumnType.MarketCapFullyDiluted]: mapNumber(ticker[ColumnType.MarketCapFullyDiluted]),
				[ColumnType.MarketCapChange24h]: mapNumber(ticker[ColumnType.MarketCapChange24h]),
				[ColumnType.MarketCapChange24hPercent]: mapPercent(ticker[ColumnType.MarketCapChange24hPercent]),
				[ColumnType.CirculatingSupply]: mapNumber(ticker[ColumnType.CirculatingSupply]),
				[ColumnType.TotalSupply]: mapNumber(ticker[ColumnType.TotalSupply]),
				[ColumnType.MaxSupply]: mapNumber(ticker[ColumnType.MaxSupply]),
				[ColumnType.UpdateDate]: mapText(ticker[ColumnType.UpdateDate]),
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
			) as CryptoTableRow[],
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
