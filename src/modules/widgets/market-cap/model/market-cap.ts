import type { TableRow, ColumnType, ISymbolCell, INumberCell, IColorCell, IPercentCell } from '@/modules/cell';

export type TickerRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.Color]: IColorCell;
	[ColumnType.MarketCapChange24hPercent]: IPercentCell;
	[ColumnType.MarketCap24h]: INumberCell;
}>;
