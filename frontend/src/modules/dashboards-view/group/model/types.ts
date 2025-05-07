export interface IPosition {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface IPositionWithId extends IPosition {
	i: number;
}

export enum DashboardItemType {
	Instance = 'instance',
	Collection = 'collection',
	Folder = 'folder',
}

export enum DashboardType {
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
}

export interface IDashboardInstance {
	type: DashboardItemType.Instance;
	id: number;
	name: string;
	dashboardType: DashboardType;
	position: IPosition;
}

export interface IDashboardCollection {
	type: DashboardItemType.Collection;
	id: number;
	name: string;
	position: IPosition;
	items: (IDashboardInstance | IDashboardFolder)[];
}

export interface IDashboardFolder {
	type: DashboardItemType.Folder;
	id: number;
	position: IPosition;
	items: IDashboardInstance[];
}

export type IDashboardItem = IDashboardInstance | IDashboardCollection | IDashboardFolder;

export interface IDashboardGroup {
	id: string;
	name: string;
	items: IDashboardItem[];
	isActive: boolean;
	market: string;
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
}
