import {
	ColumnType,
	type ISymbolCell,
	type TableRow,
	type ITableColumn,
	buildColumns,
} from '@/modules/cell';


export type StockTableRow = TableRow<{
	[ColumnType.Symbol]:ISymbolCell;
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
			isDraggable: false,
			isShow: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.Open,
			isDraggable: false,
			isShow: true,
			groupOrder: 2,
		},
		{
			columnType: ColumnType.Incentive,
			isDraggable: false,
			isShow: true,
			groupOrder: 2,
		},
		{
			columnType: ColumnType.MarketHours,
			isDraggable: false,
			isShow: true,
			groupOrder: 2,
		},

	]);

