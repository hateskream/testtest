export enum MarketType {
	Crypto = 'crypto',
	Stock = 'stock',
	Forex = 'forex',
	Commodities = 'commodities',
	Indices = 'indices',
}

export const marketToLabel: Record<MarketType, string> = {
	[MarketType.Crypto]: 'Crypto',
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
