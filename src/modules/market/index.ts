export enum MarketType {
	Crypto = 'crypto',
	Stock = 'stock',
	Forex = 'forex',
	Commodities = 'commodity',
	Indices = 'index',
}

export const marketToLabel: Record<MarketType, string> = {
	[MarketType.Crypto]: 'Crypto',
	[MarketType.Stock]: 'Stock',
	[MarketType.Forex]: 'Forex',
	[MarketType.Commodities]: 'Commodity',
	[MarketType.Indices]: 'Index',
};

export const marketToName: Record<MarketType, string> = {
	[MarketType.Crypto]: 'Cryptocurrency',
	[MarketType.Stock]: 'Stock',
	[MarketType.Forex]: 'Forex',
	[MarketType.Commodities]: 'Commodity',
	[MarketType.Indices]: 'Index',
};

export function getMarketLabel(market: MarketType): string {
	return marketToLabel[market];
}

interface IMarket {
	type: MarketType;
	label: string;
}

export function getAllMarkets(): IMarket[] {
	return Object.values(MarketType).map(market => ({
		type: market,
		label: getMarketLabel(market),
	}));
}
