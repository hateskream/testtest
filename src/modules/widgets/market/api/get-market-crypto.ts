import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import {
	ColumnType,
	type ColumnWithoutSymbol,
	type ISort,
	type NumberDto,
	type PercentDto,
	prepareMarketResponse,
	type SvgChartDto,
	type SymbolDto,
	SymbolType,
	type TableRowDto,
	type TextDto,
} from '@/modules/cell';
import type { CryptoTableRow, ISelectedFilter } from '../model';
import type { MarketType } from '@/modules/market';
import { generateRows } from '@/shared/mock';

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
		if (IS_USE_MOCK) {
			return getMockData();
		}

		const response = await httpService.get<IGetMarketResponse>('/api/market');

		return prepareMarketResponse<CryptoTableRow>(response.data);
	} catch (error) {
		logger.error('Failed to get market', { error: error as Error });
		throw error;
	}
}


async function getMockData(): Promise<IPreparedResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const columnTypes: ColumnWithoutSymbol[] = [
		ColumnType.PriceCurrent,
		ColumnType.PriceMin24h,
		ColumnType.PriceMax24h,
		ColumnType.PriceMin1y,
		ColumnType.PriceMax1y,
		ColumnType.PriceAvg50d,
		ColumnType.PriceAvg200d,
		ColumnType.PriceOpen,
		ColumnType.PriceClose,
		ColumnType.AllTimeHigh,
		ColumnType.AllTimeHighChangePercent,
		ColumnType.AllTimeHighDate,
		ColumnType.AllTimeLow,
		ColumnType.AllTimeLowChangePercent,
		ColumnType.AllTimeLowDate,
		ColumnType.ChangePrice24h,
		ColumnType.ChangePrice24hPercent,
		ColumnType.Volume24h,
		ColumnType.MarketCap24h,
		ColumnType.MarketCapRank,
		ColumnType.MarketCapFullyDiluted,
		ColumnType.MarketCapChange24h,
		ColumnType.MarketCapChange24hPercent,
		ColumnType.CirculatingSupply,
		ColumnType.TotalSupply,
		ColumnType.MaxSupply,
		ColumnType.UpdateDate,
		ColumnType.Price24hChart,
	];

	const response: IPreparedResponse = {

		pagination: {
			offset: 0,
			limit: 10,
			total: 10,
		},
		tickers: await generateRows(SymbolType.Crypto, columnTypes, 12),
	};

	return response;
}
