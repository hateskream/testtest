import { type IWatchlistRow } from './cells.model';

// Widget full configuration
export interface IWatchlistWidgetConfig {
	widgetId: string;
	activeTabId: string;
	tabs: IWatchlistTab[];
	// table: IWatchlistTable;
}

export interface IWatchlistTable {
	id: string;
	columns: IWatchlistColumn[];
	sections: IWatchlistSection[];
	tickerState: IWatchlistTickerState;
}

export interface IWatchlistTickerState {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isShowDescription: boolean;
}

export interface IWatchlistColumn {
	id: string;
	columnType: string;
	isShow: boolean;
	order: number;
	sort?: string;
	width?: number;
}

export interface IWatchlistSection {
	id: string;
	name: string;
	order: number;
	isOpen: boolean;
	type?: MarketType;
	rows: IWatchlistRow[];
	totalCount: number;
}

export interface IWatchlistTab {
	id: string;
	name: string;
	order: number;
}

// Enum for Market Types
export enum MarketType {
	Crypto = 'Crypto',
	Stock = 'Stock',
	Forex = 'Forex',
	Commodity = 'Commodity',
	Index = 'Index',
	Custom = 'Custom',
}

// Tab menu actions
export type TabMenuAction = | 'rename' | 'share' | 'duplicate' | 'addAlert' | 'addSymbolsToList';
