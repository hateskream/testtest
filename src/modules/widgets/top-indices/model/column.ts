import { buildColumns, ColumnType, type ITableColumn } from '@/modules/cell';

export const ALL_COLUMNS: ITableColumn[] =
	buildColumns(
		[
			{
				columnType: ColumnType.Symbol,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.ChangePriceYTDPercent,
				groupOrder: 0,
				isShow: true,
				isDraggable: true,
			},
			{
				columnType: ColumnType.ChangePriceYTD,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Volatility,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
		],
	);
