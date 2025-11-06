import {
	buildColumns,
	ColumnType,
	type IPercentCell,
	type ISymbolCell,
	type ITableColumn,
	type TableRow,
} from '@/modules/cell';

export enum DisplayVariant {
	Bar = 'bar',
	List = 'list',
}

export type PerformanceTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.Performance]: IPercentCell;
}>;

export const ALTCOIN_PERFORMANCE_COLUMNS: ITableColumn[] =
	buildColumns(
		[
			{
				columnType: ColumnType.Symbol,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Performance,
				groupOrder: 0,
				isShow: true,
				isDraggable: true,
			},
		],
	);
