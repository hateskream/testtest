import { SymbolType } from '@/modules/cell';

export const TickerType = {
	CRYPTO: 'crypto',
	STOCK: 'stock',
	FOREX: 'forex',
	COMMODITIES: 'commodities',
	INDICES: 'indices',
	ETF: 'etf',
} as const;

export type TickerType = typeof TickerType[keyof typeof TickerType];

const TickerTypeToSymbolType = {
	[TickerType.CRYPTO]: SymbolType.Crypto,
	[TickerType.STOCK]: SymbolType.Stock,
	[TickerType.FOREX]: SymbolType.Forex,
	[TickerType.COMMODITIES]: SymbolType.Commodity,
	[TickerType.INDICES]: SymbolType.Index,
	[TickerType.ETF]: SymbolType.Etf,
} as const satisfies Record<TickerType, SymbolType>;

export function createTickerIdFromType(type: TickerType, payload: string): string {
	return `${ TickerTypeToSymbolType[type] }-${payload}`;
}
