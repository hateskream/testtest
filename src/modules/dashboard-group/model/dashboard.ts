import { IconIds } from '@/shared/ui/icon';
import { WidgetType } from './widgets';

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

export enum DashboardItemType {
	Instance = 'instance',
	Stack = 'stack',
	Folder = 'folder',
}

export interface IDashboardItem {
	type: DashboardItemType;
	name: string;
	id: number;
	icon: IconIds;
	description: string;
	position: IPosition;
	maxSize: ISize;
	minSize: ISize;
}

export interface IDashboardInstance extends IDashboardItem {
	type: DashboardItemType.Instance;
	dashboardType: WidgetType;
}

export interface IDashboardStack extends IDashboardItem {
	type: DashboardItemType.Stack;
	items: (IDashboardInstance | IDashboardFolder)[];
}

export interface IDashboardFolder extends IDashboardItem {
	type: DashboardItemType.Folder;
	items: IDashboardInstance[];
}

const WIDGET_MIN_SIZE = { w: 1, h: 2 };
const WIDGET_MAX_SIZE = { w: Infinity, h: Infinity };

export const INIT_DASHBOARDS: (IDashboardInstance | IDashboardFolder | IDashboardStack) [] = [
	{
		type: DashboardItemType.Instance,
		id: 0,
		name: 'Hot Markets',
		dashboardType: WidgetType.HotMarkets,
		position: { x: 0, y: 0, w: 2, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetFearAndGreat,
		description: 'Hot Markets',
	},
	{
		type: DashboardItemType.Instance,
		id: 1,
		name: 'Fear & Greed',
		dashboardType: WidgetType.FearGreed,
		position: { x: 2, y: 0, w: 2, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetFearAndGreat,
		description: 'Hot Markets',
	},
	{
		type: DashboardItemType.Instance,
		id: 2,
		name: 'Price',
		dashboardType: WidgetType.Price,
		position: { x: 4, y: 0, w: 2, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetFearAndGreat,
		description: 'Hot Markets',
	},
	{
		type: DashboardItemType.Instance,
		id: 3,
		name: 'Market',
		dashboardType: WidgetType.Market,
		position: { x: 0, y: 4, w: 3, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetFearAndGreat,
		description: 'Hot Markets',
	},
	{
		type: DashboardItemType.Instance,
		id: 4,
		name: 'News',
		dashboardType: WidgetType.News,
		position: { x: 3, y: 4, w: 3, h: 4 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetFearAndGreat,
		description: 'Hot Markets',
	},
	{
		type: DashboardItemType.Instance,
		id: 5,
		name: 'Watchlist',
		dashboardType: WidgetType.Watchlist,
		position: { x: 0, y: 0, w: 6, h: 8 },
		minSize: WIDGET_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetFearAndGreat,
		description: 'Watchlist',
	},

];

const NEW_DASHBOARD_MIN_SIZE: ISize = { w: 2, h: 4 };

export const ALL_DASHBOARDS: IDashboardInstance[] = [
	{
		type: DashboardItemType.Instance,
		id: 13,
		name: 'Market',
		dashboardType: WidgetType.Market,
		position: { x: -1, y: -1, w: -1, h: -1 },
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetMarket,
		description: 'Candlestick formations and price action analysis.',
	},
	{
		type: DashboardItemType.Instance,
		id: 11,
		name: 'Fear & Greed',
		dashboardType: WidgetType.FearGreed,
		position: { x: -1, y: -1, w: -1, h: -1 },
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetFearAndGreat,
		description: 'Market sentiment index',
	},
	{
		type: DashboardItemType.Instance,
		id: 12,
		name: 'Price',
		dashboardType: WidgetType.Price,
		position: { x: -1, y: -1, w: -1, h: -1 },
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetPrice,
		description: 'Real-time crypto price and chart',
	},
	{
		type: DashboardItemType.Instance,
		id: 14,
		name: 'News',
		dashboardType: WidgetType.News,
		position: { x: -1, y: -1, w: -1, h: -1 },
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetNews,
		description: 'Stay in the know',
	},
	{
		type: DashboardItemType.Instance,
		id: 10,
		name: 'Watchlist',
		dashboardType: WidgetType.Watchlist,
		position: { x: -1, y: -1, w: -1, h: -1 },
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetWatchlist,
		description: 'Favorite symbols',
	},
	{
		type: DashboardItemType.Instance,
		id: 15,
		name: 'Market Cap',
		dashboardType: WidgetType.MarketCap,
		position: { x: -1, y: -1, w: -1, h: -1 },
		minSize: NEW_DASHBOARD_MIN_SIZE,
		maxSize: WIDGET_MAX_SIZE,
		icon: IconIds.LogoWidgetMarketCap,
		description: 'Total value of all coins in circulation',
	},
];
