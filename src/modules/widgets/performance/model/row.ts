import type {
	ColumnType,
	IPercentCell,
	ISymbolCell,
	TableRow,
} from '@/modules/cell';

export type PerformanceTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
}>;
