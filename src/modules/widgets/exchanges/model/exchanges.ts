export enum MarketType {
	Stock = 'stock',
	CryptoCEX = 'cryptoCEX',
	CryptoDEX = 'cryptoDEX',
}

export const marketToLabel: Record<MarketType, string> = {
	[MarketType.Stock]: 'Stock',
	[MarketType.CryptoCEX]: 'Crypto',
	[MarketType.CryptoDEX]: 'Crypto',
};

export function getMarketLabel(market: MarketType): string {
	return marketToLabel[market];
}

