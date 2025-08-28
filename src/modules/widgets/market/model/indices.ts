import {
	ColumnType,
	type ISymbolCell,
	type INumberCell,
	type IPercentCell,
	type ITextCell,
	type ISvgChartCell,
	type TableRow,
	type ITableColumn,
	buildColumns,
} from '@/modules/cell';

export type IndicesTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.ChangePrice24h]: INumberCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.Volume24h]: INumberCell;
	[ColumnType.PriceMin24h]: INumberCell;
	[ColumnType.PriceMax24h]: INumberCell;
	[ColumnType.PriceMin1y]: INumberCell;
	[ColumnType.PriceMax1y]: INumberCell;
	[ColumnType.PriceAvg50d]: INumberCell;
	[ColumnType.PriceAvg200d]: INumberCell;
	[ColumnType.PriceOpen]: INumberCell;
	[ColumnType.PriceClose]: INumberCell;
	[ColumnType.UpdateDate]: ITextCell;
	[ColumnType.Price24hChart]: ISvgChartCell;
}>;

export const INDICES_ALL_COLUMNS: ITableColumn[] =
	buildColumns([
		{
			columnType: ColumnType.Symbol,
			isDraggable: false,
			isShow: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceCurrent,
			groupOrder: 0,
			isShow: true,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice24h,
			isShow: true,
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
			columnType: ColumnType.PriceMin24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceMax24h,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceMin1y,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceMax1y,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceAvg50d,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceAvg200d,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceOpen,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceClose,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.UpdateDate,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Price24hChart,
			isShow: true,
			isDraggable: true,
			groupOrder: 0,
		},
	]);
