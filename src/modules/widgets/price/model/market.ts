import { MarketType } from '@/modules/market';

export enum PriceMarketType {
	Crypto = 'crypto',
	Stock = 'stock',
	Commodity = 'commodity',
	Forex = 'forex',
	Index = 'index',
}

export const MarketTypeToPriceMarketTypeMap: Record<MarketType, PriceMarketType> = {
	[MarketType.Crypto]: PriceMarketType.Crypto,
	[MarketType.Stock]: PriceMarketType.Stock,
	[MarketType.Forex]: PriceMarketType.Forex,
	[MarketType.Indices]: PriceMarketType.Index,
	[MarketType.Commodities]: PriceMarketType.Commodity,
};

export function marketTypeToPriceMarketType(marketType: MarketType): PriceMarketType {
	return MarketTypeToPriceMarketTypeMap[marketType];
}

export function priceMarketTypeToMarketType(priceMarketType: PriceMarketType): MarketType {
	return Object.entries(MarketTypeToPriceMarketTypeMap)
		.find(([_, marketTypeValue]) => marketTypeValue === priceMarketType)?.[0] as MarketType;
}

