import type { WidgetType } from '../new-model';

export interface IDashboardGroup {
	activeDashboardId: string;
	dashboards: IDashboard[];
}

export interface IDashboard {
	id: string;
	name: string;
	order: number;
	widgets: IWidget[];
}

export interface IWidget {
	id: string;
	widgetType: WidgetType;
	name: string;
	description: string;
	position: IPosition;
	maxSize: ISize;
	minSize: ISize;
	defaultStateType: string;
}

export interface IPosition {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface ISize {
	w: number;
	h: number;
}

export interface IWidgetPreset {
	widgetType: WidgetType;
	name: string;
	description: string;
	maxSize: ISize;
	minSize: ISize;
	defaultSize: ISize;
}

export interface IWidgetState {
	id: string;
	position: IPosition;
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
}

// 1727 или 1728

export interface IMeta {
	widgetId: string;
	isResizing: boolean;
	isLoading: boolean;
	market: string;
	name: string;
	size: ISize;
	defaultStateType: string;
}

// export enum WidgetType {
// 	FearGreed = 'fear-greed',
// 	BitcoinDominance = 'bitcoin-dominance',
// 	Market = 'market',
// 	MarketCap = 'market-cap',
// 	News = 'news',
// 	Price = 'price',
// 	Watchlist = 'watchlist',
// 	Performance = 'performance',
// 	AltcoinSeason = 'altcoin-season',
// 	TopIndices = 'top-indices',
// 	Calendar = 'calendar',
// 	Heatmap = 'heatmap',
// }
