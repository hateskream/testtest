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

export interface IMeta {
	isResizing: boolean;
	market: string;
	name: string;
	size: ISize;
}

export enum WidgetType {
	FearGreed = 'fear-greed',
	BitcoinDominanc = 'bitcoin-dominanc',
	Market = 'market',
	MarketCap = 'market-cap',
	News = 'news',
	Price = 'price',
	HotMarkets = 'hot-markets',
	Search = 'search',
	Insiders = 'insiders',
	Events = 'events',
	Telegram = 'telegram',
	Chart = 'chart',
	Watchlist = 'watchlist',
	Performance = 'performance',
	AltcoinSeason = 'altcoin-season',
}
