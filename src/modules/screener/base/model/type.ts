export enum ScreenerType {
	Stock = 'stock',
	Crypto = 'crypto',
	ETF = 'etf',
	Bond = 'bond',
	CEX = 'cex',
	DEX = 'dex',
}

export const screenerTypeToLabel: Record<ScreenerType, string> = {
	[ScreenerType.Stock]: 'Stock',
	[ScreenerType.Crypto]: 'Crypto',
	[ScreenerType.ETF]: 'ETF',
	[ScreenerType.Bond]: 'Bond',
	[ScreenerType.CEX]: 'CEX',
	[ScreenerType.DEX]: 'DEX',
};
