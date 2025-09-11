import type { TableRow, ColumnType, ISymbolCell, IColorCell, IPercentCell } from '@/modules/cell';

export type TickerRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.Color]: IColorCell;
	[ColumnType.Dominance24hPercent]: IPercentCell;
	[ColumnType.Dominance7dPercent]: IPercentCell;
	[ColumnType.Dominance30dPercent]: IPercentCell;
}>;
