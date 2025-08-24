import { buildColumns, ColumnType, type ITableColumn } from '@/modules/cell';

export const ALL_COLUMNS: ITableColumn[] = buildColumns(
	[
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
	],
);
