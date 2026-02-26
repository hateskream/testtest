export enum MarketType {
	Crypto = 'crypto',
	Stock = 'stock',
	Forex = 'forex',
	Commodities = 'commodity',
	Indices = 'index',
	Etf = 'etf',
}

export const ALL_MARKET_TYPES = Object.values(MarketType);

export const marketToLabel: Record<MarketType, string> = {
	[MarketType.Crypto]: 'Crypto',
	[MarketType.Stock]: 'Stock',
	[MarketType.Forex]: 'Forex',
	[MarketType.Commodities]: 'Commodity',
	[MarketType.Indices]: 'Index',
	[MarketType.Etf]: 'ETF',
};

export const marketToName: Record<MarketType, string> = {
	[MarketType.Crypto]: 'Cryptocurrency',
	[MarketType.Stock]: 'Stock',
	[MarketType.Forex]: 'Forex',
	[MarketType.Commodities]: 'Commodity',
	[MarketType.Indices]: 'Index',
	[MarketType.Etf]: 'ETF',
};

export function getMarketLabel(market: MarketType): string {
	return marketToLabel[market];
}

interface IMarket {
	type: MarketType;
	label: string;
}

export function getAllMarkets(): IMarket[] {
	return ALL_MARKET_TYPES.map(market => ({
		type: market,
		label: getMarketLabel(market),
	}));
}
