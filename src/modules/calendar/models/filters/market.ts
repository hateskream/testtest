import { IconIds } from '@/shared/ui/icon';

export enum MarketIds {
	USA = 'usa',
	India = 'india',
	Germany = 'germany',
	Japan = 'japan',
	Canada = 'canada',
	HongKong = 'hongkong',
	UnitedKingdom = 'united-kingdom',
}

export interface IMarketData {
	id: MarketIds;
	label: string;
	icon: IconIds;
}

export const markets: IMarketData[] = [
	{ id: MarketIds.USA, label: 'USA', icon: IconIds.USA },
	{ id: MarketIds.India, label: 'India', icon: IconIds.India },
	{ id: MarketIds.Germany, label: 'Germany', icon: IconIds.Germany },
	{ id: MarketIds.Japan, label: 'Japan', icon: IconIds.Japan },
	{ id: MarketIds.Canada, label: 'Canada', icon: IconIds.Canada },
	{ id: MarketIds.HongKong, label: 'Hong Kong, China', icon: IconIds.HongKong },
	{ id: MarketIds.UnitedKingdom, label: 'United Kingdom', icon: IconIds.UnitedKingdom },
] as const;

export const MARKET_ID_TO_ISO: Record<MarketIds, string> = {
	[MarketIds.USA]: 'US',
	[MarketIds.India]: 'IN',
	[MarketIds.Germany]: 'DE',
	[MarketIds.Japan]: 'JP',
	[MarketIds.Canada]: 'CA',
	[MarketIds.HongKong]: 'HK',
	[MarketIds.UnitedKingdom]: 'GB',
};
