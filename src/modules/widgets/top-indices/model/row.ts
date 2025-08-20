import type {
	ColumnType,
	ILableCell,
	INumberCell,
	IPercentCell,
	ISymbolCell,
	TableRow,
} from '@/modules/cell';

export type CryptoTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.ChangePrice24h]: INumberCell;
	[ColumnType.Volatility]: ILableCell;
}>;
