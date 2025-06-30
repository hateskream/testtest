// Core types and enums used across watchlist models

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
export type TabMenuAction =
	| 'rename'
	| 'share'
	| 'duplicate'
	| 'addAlert'
	| 'addSymbolsToList';

// Table cell value types - corresponds to cell types from cells.model.ts
export type ITableRowValueType =
	| 'symbol' // IWatchlistSymbolCell
	| 'number' // IWatchlistNumberCell
	| 'percent' // IWatchlistPercentCell
	| 'chart' // IWatchlistSvgChartCell
	| 'text' // IWatchlistTextCell
	| 'range' // IWatchlistRangeCell
	| 'image' // Legacy support
	| 'image-string' // Legacy support
	| 'string' // Legacy support
	| 'date'; // Legacy support

// Table column sort direction
export type ITableColumnDirection = 0 | 1 | -1;
