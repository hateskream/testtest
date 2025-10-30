import {
	buildColumns,
	ColumnType,
	type INumberCell,
	type IPercentCell,
	type IRangeCell,
	type ISymbolCell,
	type ITableColumn,
	type ITextCell,
	type TableRow,
} from '@/modules/cell';

export type StockTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.Price1yRange]: IRangeCell;
	[ColumnType.Price24hChart]: INumberCell;
	[ColumnType.Beta5y]: INumberCell;
	[ColumnType.ChangePrice24h]: INumberCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.Volume24h]: INumberCell;
	[ColumnType.VolumeAvg50d]: INumberCell;
	[ColumnType.VolumeRel24h]: INumberCell;
	[ColumnType.VolumeRelAvg50d]: INumberCell;
	[ColumnType.PriceEarnings]: INumberCell;
	[ColumnType.MarketCap24h]: ITextCell;
	[ColumnType.EpsDil12mo]: INumberCell;
	[ColumnType.EpsDilAvg50d]: INumberCell;
	[ColumnType.EpsDilGrowth12mo]: IPercentCell;
	[ColumnType.EpsDilGrowthAvg50d]: IPercentCell;
	[ColumnType.DividendYield]: IPercentCell;
	[ColumnType.LastDividend]: INumberCell;
	[ColumnType.Employees]: ITextCell;
	[ColumnType.IpODate]: ITextCell;
	[ColumnType.Sector]: ITextCell;
	[ColumnType.Industry]: ITextCell;
	[ColumnType.AnalystRating]: ITextCell;
	[ColumnType.Source]: ITextCell;
}>;

export const STOCK_ALL_COLUMNS: ITableColumn[] =
	buildColumns([
		{
			columnType: ColumnType.Symbol,
			isDraggable: false,
			isShow: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceCurrent,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Price1yRange,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Price24hChart,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Beta5y,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.ChangePrice24h,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.ChangePrice24hPercent,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Volume24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.VolumeAvg50d,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.VolumeRel24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.VolumeRelAvg50d,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.MarketCap24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceEarnings,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.EpsDil12mo,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.EpsDilAvg50d,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.EpsDilGrowth12mo,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.EpsDilGrowthAvg50d,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.DividendYield,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.LastDividend,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Employees,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.IpODate,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Sector,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Industry,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.AnalystRating,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Source,
			isShow: false,
			isDraggable: true,
			groupOrder: 0,
		},
	]);
