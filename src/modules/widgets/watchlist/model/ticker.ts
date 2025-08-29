import type {
	TableRow,
	ColumnType,
	ISymbolCell,
	INumberCell,
} from '@/modules/cell';
import type { MarketType } from '@/modules/market';

export type Ticker = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;

	[ColumnType.PriceCurrent]: INumberCell;
}>;


export interface ITickerAction {
	tickerType: MarketType;
	tabId: string;
	tickerId: string;
}
