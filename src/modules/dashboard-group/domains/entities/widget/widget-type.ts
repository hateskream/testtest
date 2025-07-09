import { DomainError } from '../error/error';

export enum WidgetType {
	FearGreed = 'fear-greed',
	Market = 'market',
	// MarketCap = 'market-cap',
	News = 'news',
	Price = 'price',
	HotMarkets = 'hot-markets',
	// Search = 'search', // delete
	// Insiders = 'insiders',
	// Events = 'events',
	// Telegram = 'telegram', // delete
	// Chart = 'chart', // delete
	Watchlist = 'watchlist',
	Performance = 'performance',
	Price2 = 'price-2',
}

export class InvalidWidgetType extends DomainError {
	constructor(type: string) {
		super(`Invalid widget type: ${type}`);
	}
}

function isWidgetType(str: string): str is WidgetType {
	return Object.values<string>(WidgetType).includes(str);
}

export function createWidgetTypeFromString(str: string): WidgetType {
	if (!isWidgetType(str)) {
		throw new InvalidWidgetType(str);
	}

	return str;
}
