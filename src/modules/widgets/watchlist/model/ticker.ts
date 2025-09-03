import type {
	TableRow,
	ColumnType,
	ISymbolCell,
	INumberCell,
	IPercentCell,
	ISvgChartCell,
	ITextCell,
	IRangeCell,
	ILableCell,
} from '@/modules/cell';
import type { MarketType } from '@/modules/market';

export type Ticker = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;

	// Price columns
	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.PriceMin24h]: INumberCell;
	[ColumnType.PriceMax24h]: INumberCell;
	[ColumnType.PriceMin1y]: INumberCell;
	[ColumnType.PriceMax1y]: INumberCell;
	[ColumnType.PriceAvg50d]: INumberCell;
	[ColumnType.PriceAvg200d]: INumberCell;
	[ColumnType.PriceOpen]: INumberCell;
	[ColumnType.PriceClose]: INumberCell;
	[ColumnType.Price1yRange]: IRangeCell;

	// Price charts
	[ColumnType.Price24hChart]: ISvgChartCell;
	[ColumnType.Price7dChart]: ISvgChartCell;
	[ColumnType.Price30dChart]: ISvgChartCell;

	// Price changes
	[ColumnType.ChangePrice24h]: INumberCell;
	[ColumnType.ChangePrice1hPercent]: IPercentCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.ChangePrice7dPercent]: IPercentCell;
	[ColumnType.ChangePrice30dPercent]: IPercentCell;

	// Volume columns
	[ColumnType.Volume24h]: INumberCell;
	[ColumnType.VolumeRel10d]: INumberCell;
	[ColumnType.VolumeAvg10d]: INumberCell;
	[ColumnType.VolumeAvg50d]: INumberCell;

	// Market cap columns
	[ColumnType.MarketCap24h]: INumberCell;
	[ColumnType.MarketCapRank]: ITextCell;
	[ColumnType.MarketCapFullyDiluted]: INumberCell;
	[ColumnType.MarketCapChange24h]: INumberCell;
	[ColumnType.MarketCapChange24hPercent]: IPercentCell;
	[ColumnType.CirculatingSupply]: INumberCell;
	[ColumnType.TotalSupply]: INumberCell;
	[ColumnType.MaxSupply]: INumberCell;

	// All-time high/low columns
	[ColumnType.AllTimeHigh]: INumberCell;
	[ColumnType.AllTimeHighChangePercent]: IPercentCell;
	[ColumnType.AllTimeHighDate]: ITextCell;
	[ColumnType.AllTimeLow]: INumberCell;
	[ColumnType.AllTimeLowChangePercent]: IPercentCell;
	[ColumnType.AllTimeLowDate]: ITextCell;

	// RSI columns
	[ColumnType.RSIValue]: INumberCell;
	[ColumnType.RSIChart]: ISvgChartCell;

	// Financial metrics
	[ColumnType.Beta5y]: INumberCell;
	[ColumnType.LastDividend]: INumberCell;

	// Company info columns
	[ColumnType.Employees]: ITextCell;
	[ColumnType.IpODate]: ITextCell;
	[ColumnType.Sector]: ITextCell;
	[ColumnType.Industry]: ITextCell;

	// Other columns
	[ColumnType.Source]: ITextCell;
	[ColumnType.ListingDate]: ITextCell;
	[ColumnType.UpdateDate]: ITextCell;
	[ColumnType.Volatility]: ILableCell;
}>;


export interface ITickerAddPayload {
	tickerType: MarketType;
	tickerId: string;
}

export interface ITickerRemovePayload {
	tickerId: string;
}
