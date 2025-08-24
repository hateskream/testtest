
import type { IWatchlistTab, IWatchlistColumn, IWatchlistSection } from '.';

// Widget full configuration
export interface IWatchlistWidgetConfig {
	widgetId: string;
	activeTabId: string;
	tabs: IWatchlistTab[];
	// table: IWatchlistTable;
}

// Watchlist table configuration
export interface IWatchlistTable {
	id: string;
	columns: IWatchlistColumn[];
	sections: IWatchlistSection[];
	tickerState: IWatchlistTickerState;
}

// Ticker display state configuration
export interface IWatchlistTickerState {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isShowDescription: boolean;
}
