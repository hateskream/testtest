// Widget full configuration
export interface IWatchlistWidgetConfig {
	widgetId: string;
	activeTabId: string;
	tabs: IWatchlistTab[];
	table: IWatchlistTable[];
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
	isShowDescriptio: boolean;
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
	watchlist: IWatchlistMarkets[];
}

export interface IWatchlistTab {
	id: string;
	name: string;
	order: number;
}

// Row model
export interface ISymbolItem {
	id: string;
	name: string;
	ticker: string;
	logoUrl?: string;
	market: MarketType;
	metrics: ISymbolMetrics;
}

// Cell dataModel
// TODO: Refactor after get backend data
export interface IWatchlistMarkets {
	[marketProp: string]: string;
	id: string;
}

// Metric configuration for columns
export interface IMetricConfig {
	id: string;
	name: string;
	displayName: string;
	isActive: boolean;
	options?: string[];
}

// Metrics for each symbol
export interface ISymbolMetrics {
	id: string;
	[key: string]: string;
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


// // Sorting configuration
// export interface ISortConfig {
// 	enabled: boolean;
// 	sortBy: keyof ISymbolMetrics;
// 	order: 'asc' | 'desc';
// }


// Tab menu actions
export type TabMenuAction = | 'rename' | 'share' | 'duplicate' | 'addAlert' | 'addSymbolsToList';

// Widget Interaction Events
export interface IWidgetInteractionEvents {
	onTabClick: (tabId: string) => void;
	onSymbolDoubleClick: (symbolId: string) => void;
	onTabMenuAction: (action: TabMenuAction, targetId: string) => void;
	onMetricChange: (metricId: string, newValue: string) => void;
}

// Complete Widget Props
export interface IWatchlistWidgetProps extends IWidgetInteractionEvents {
	config: IWatchlistWidgetConfig;
}
