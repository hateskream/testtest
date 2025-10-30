export enum ScreenerMarket {
	USA = 'usa',
	India = 'india',
	Germany = 'germany',
	Japan = 'japan',
	Canada = 'canada',
	HongKong = 'hongkong',
	UK = 'uk',
}

export const screenerMarketToLabel: Record<ScreenerMarket, string> = {
	[ScreenerMarket.USA]: 'USA',
	[ScreenerMarket.India]: 'India',
	[ScreenerMarket.Germany]: 'Germany',
	[ScreenerMarket.Japan]: 'Japan',
	[ScreenerMarket.Canada]: 'Canada',
	[ScreenerMarket.HongKong]: 'Hong Kong, China',
	[ScreenerMarket.UK]: 'United Kingdom',
};
