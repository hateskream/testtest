export interface IDashboardGroup {
	id: string;
	name: string;
	dashboards: IDashboardInstance[];
	isActive: boolean;
}

export interface IDashboardInstance {
	id: string;
	type: DashboardType;
	position: { x: number; y: number; w: number; h: number };
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
}

export enum DashboardType {
	FearGreed = 'fear-greed',
	Market = 'market',
	MarketCap = 'market-cap',
	News = 'news',
	Price = 'price',
}
