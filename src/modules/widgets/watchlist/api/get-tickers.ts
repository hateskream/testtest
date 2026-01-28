import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { type Ticker } from '../model';
import { arrayToString } from '@/shared/lib';
import {
	ColumnType,
	type LabelDto,
	mapTickersToTableRows,
	type NumberDto,
	type PercentDto,
	type RangeDto,
	type SvgChartDto,
	type SymbolDto,
	type TableRowDto,
	type TextDto,
} from '@/modules/cell';
import { generateAllRows } from '@/shared/mock';

const IS_USE_MOCK = true;

export interface IGetWatchlistRequest {
	tickerIds: string[];
}

export type TickerDto = TableRowDto<{
	// Symbol column
	[ColumnType.Symbol]: SymbolDto;

	// Price columns
	[ColumnType.PriceCurrent]: NumberDto;
	[ColumnType.PriceMin24h]: NumberDto;
	[ColumnType.PriceMax24h]: NumberDto;
	[ColumnType.PriceMin1y]: NumberDto;
	[ColumnType.PriceMax1y]: NumberDto;
	[ColumnType.PriceAvg50d]: NumberDto;
	[ColumnType.PriceAvg200d]: NumberDto;
	[ColumnType.PriceOpen]: NumberDto;
	[ColumnType.PriceClose]: NumberDto;
	[ColumnType.Price1yRange]: RangeDto;

	// Price charts
	[ColumnType.Price24hChart]: SvgChartDto;
	[ColumnType.Price7dChart]: SvgChartDto;
	[ColumnType.Price30dChart]: SvgChartDto;

	// Price changes
	[ColumnType.ChangePrice24h]: NumberDto;
	[ColumnType.ChangePrice1hPercent]: PercentDto;
	[ColumnType.ChangePrice24hPercent]: PercentDto;
	[ColumnType.ChangePrice7dPercent]: PercentDto;
	[ColumnType.ChangePrice30dPercent]: PercentDto;

	// Volume columns
	[ColumnType.Volume24h]: NumberDto;
	[ColumnType.VolumeRel10d]: NumberDto;
	[ColumnType.VolumeAvg10d]: NumberDto;
	[ColumnType.VolumeAvg50d]: NumberDto;

	// Market cap columns
	[ColumnType.MarketCap24h]: NumberDto;
	[ColumnType.MarketCapRank]: TextDto;
	[ColumnType.MarketCapFullyDiluted]: NumberDto;
	[ColumnType.MarketCapChange24h]: NumberDto;
	[ColumnType.MarketCapChange24hPercent]: PercentDto;
	[ColumnType.CirculatingSupply]: NumberDto;
	[ColumnType.TotalSupply]: NumberDto;
	[ColumnType.MaxSupply]: NumberDto;

	// All-time high/low columns
	[ColumnType.AllTimeHigh]: NumberDto;
	[ColumnType.AllTimeHighChangePercent]: PercentDto;
	[ColumnType.AllTimeHighDate]: TextDto;
	[ColumnType.AllTimeLow]: NumberDto;
	[ColumnType.AllTimeLowChangePercent]: PercentDto;
	[ColumnType.AllTimeLowDate]: TextDto;

	// RSI columns
	[ColumnType.RSIValue]: NumberDto;
	[ColumnType.RSIChart]: SvgChartDto;

	// Financial metrics
	[ColumnType.Beta5y]: NumberDto;
	[ColumnType.LastDividend]: NumberDto;

	// Company info columns
	[ColumnType.Employees]: TextDto;
	[ColumnType.IpODate]: TextDto;
	[ColumnType.Sector]: TextDto;
	[ColumnType.Industry]: TextDto;

	// Other columns
	[ColumnType.Source]: TextDto;
	[ColumnType.ListingDate]: TextDto;
	[ColumnType.UpdateDate]: TextDto;
	[ColumnType.Volatility]: LabelDto;
}>;

export interface IGetWatchlistResponse {
	data: {
		tickers: TickerDto[];
	};
}

export async function getTickers({ tickerIds }: IGetWatchlistRequest): Promise<Ticker[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData(tickerIds)
			: await httpService.get<IGetWatchlistResponse>('/api/v1/watchlist/', {
				query: {
					tickers: arrayToString(tickerIds),
				},
			});

		return mapTickersToTableRows<Ticker>(response.data.tickers);
	} catch (error) {
		logger.error('Failed to get watchlist', { error: error as Error });
		throw error;
	}
}

async function getMockData(_: string[]): Promise<IGetWatchlistResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});


	const response: IGetWatchlistResponse = {
		data: {
			tickers: await generateAllRows(),
		},
	};
	return response;
}
