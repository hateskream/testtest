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
}

const WIDGET_MIN_SIZE = { w: 1, h: 2 };
const WIDGET_MAX_SIZE = { w: Infinity, h: Infinity };
const NEW_DASHBOARD_MIN_SIZE: ISize = { w: 2, h: 4 };

export const INIT_DASHBOARDS: IWidget[] = [
	{
		id: '0',
		name: 'Hot Markets',
		widgetType: WidgetType.HotMarkets,
		position: { x: 0, y: 0, w: 2, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Hot Markets',
	},
	{
		id: '1',
		name: 'Fear & Greed',
		widgetType: WidgetType.FearGreed,
		position: { x: 2, y: 0, w: 2, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: { w: 2, h: 6 },
		description: 'Hot Markets',
	},
	{
		id: '2',
		name: 'Price',
		widgetType: WidgetType.Price,
		position: { x: 4, y: 0, w: 2, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Hot Markets',
	},
	{
		id: '3',
		name: 'Market',
		widgetType: WidgetType.Market,
		position: { x: 0, y: 4, w: 3, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Hot Markets',
	},
	{
		id: '4',
		name: 'News',
		widgetType: WidgetType.News,
		position: { x: 3, y: 4, w: 3, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Hot Markets',
	},
	{
		id: '5',
		name: 'Watchlist',
		widgetType: WidgetType.Watchlist,
		position: { x: 0, y: 0, w: 6, h: 8 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Watchlist',
	},

];

export const ALL_DASHBOARDS: IWidgetPreset[] = [
	{
		name: 'Market',
		widgetType: WidgetType.Market,
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Candlestick formations and price action analysis.',
		defaultSize: { w: 2, h: 4 },
	},
	{
		name: 'Fear & Greed',
		widgetType: WidgetType.FearGreed,
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Market sentiment index',
		defaultSize: { w: 2, h: 4 },
	},
	{
		name: 'Price',
		widgetType: WidgetType.Price,
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Real-time crypto price and chart',
		defaultSize: { w: 2, h: 4 },
	},
	{
		name: 'News',
		widgetType: WidgetType.News,
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Stay in the know',
		defaultSize: { w: 2, h: 4 },
	},
	{
		name: 'Watchlist',
		widgetType: WidgetType.Watchlist,
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Favorite symbols',
		defaultSize: { w: 2, h: 4 },
	},
	{
		name: 'Market Cap',
		widgetType: WidgetType.MarketCap,
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		description: 'Total value of all coins in circulation',
		defaultSize: { w: 2, h: 4 },
	},
];
