// Widget full configuration
export interface IWatchlistWidgetConfig {
	widgetId: string;
	activeTabId: string;
	tabs: IWatchlistTab[]; // TODO: refactor
	// table: IWatchlistSection[]; // TODO: refactor
}

// export interface IWatchlistTable {
// 	ID: string;
// 	Columns: Column[];
// 	Sections: Section[];
// 	// TODO: TickerState: TickerState;
// }

export interface IWatchlistColumn {
	id: string;
	columnType: string;
	isShow: boolean;
	sort?: string;
	order: number;
	width?: number;
}


export interface IWatchlistSection {
	id: string;
	name: string;
	type?: MarketType;
	isOpen: boolean;
	watchlist: IWatchlistMarkets[];
}

export interface IWatchlistTab {
	id: string;
	name: string;
	isActive?: boolean;
	isEditing?: boolean;
	symbols: ISymbolItem[];
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


// Sorting configuration
export interface ISortConfig {
	enabled: boolean;
	sortBy: keyof ISymbolMetrics;
	order: 'asc' | 'desc';
}


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
