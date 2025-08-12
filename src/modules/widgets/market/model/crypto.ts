import type { ColumnType, ISymbolCell, INumberCell, IPercentCell, ITextCell } from '@/modules/cell';
import type { TableRow } from './table';

export type CryptoTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.Volume24h]: INumberCell;
	[ColumnType.MarketCap24h]: INumberCell;
	[ColumnType.ListingDate]: ITextCell;
}>;
