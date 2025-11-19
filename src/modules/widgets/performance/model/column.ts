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
				columnType: ColumnType.ChangePrice24hPercent,
				groupOrder: 0,
				isShow: true,
				isDraggable: true,
				extended: true,
				maxWidth: '200px',
				minWidth: '200px',
				width: '200px',
			},
		],
	);
