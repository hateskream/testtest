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
}

export interface IMeta {
	isResizing: boolean;
	market: string;
	name: string;
}
