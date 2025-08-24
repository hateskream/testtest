import type {
	TableRow,
	ColumnType,
	ISymbolCell,
	INumberCell,
} from '@/modules/cell';

export type Ticker = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;

	[ColumnType.PriceCurrent]: INumberCell;
}>;
