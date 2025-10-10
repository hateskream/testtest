import type { ISymbolCell, INumberCell, IPercentCell, ISvgChartCell, TableRow, ColumnType } from '@/modules/cell';

export type TickerWithoutState = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
	[ColumnType.ChangePrice24hPercent]: IPercentCell;
	[ColumnType.Price24hChart]: ISvgChartCell;
}>;

export type ITicker = TickerWithoutState & {
	isPined: boolean;
	isShow: boolean;
};
