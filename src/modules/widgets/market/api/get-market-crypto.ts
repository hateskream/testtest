import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	type SymbolDto,
	type NumberDto,
	type PercentDto,
	type TextDto,
	type SvgChartDto,
	ColumnType,
	prepareMarketResponse,
	type TableRowDto,
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

export type TickerDto = TableRowDto<{
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

		return prepareMarketResponse<CryptoTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
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
