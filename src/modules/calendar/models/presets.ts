import { EventType, Impact, type IToolbarState, MarketIds } from '@/modules/calendar';

export const DEFAULT_STATE: IToolbarState = {
	marketId: MarketIds.EntireWorld,
	impact: Impact.All,
	eventType: EventType.All,
	watchlistId: null,
	watchlistSection: null,
};

export function getDefaultState(defaultState?: string): IToolbarState {
	switch (defaultState) {
		case 'all':
			return {
				marketId: MarketIds.EntireWorld,
				impact: Impact.All,
				eventType: EventType.All,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'high-impact':
			return {
				marketId: MarketIds.EntireWorld,
				impact: Impact.High,
				eventType: EventType.All,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'usa-earnings':
			return {
				marketId: MarketIds.USA,
				impact: Impact.All,
				eventType: EventType.Earnings,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'crypto':
			return {
				marketId: MarketIds.EntireWorld,
				impact: Impact.All,
				eventType: EventType.Crypto,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'dividends-europe':
			return {
				marketId: MarketIds.Germany,
				impact: Impact.All,
				eventType: EventType.Dividends,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'earnings-week':
			return {
				marketId: MarketIds.EntireWorld,
				impact: Impact.Medium,
				eventType: EventType.Earnings,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'popular':
			return {
				marketId: MarketIds.USA,
				impact: Impact.High,
				eventType: EventType.Earnings,
				watchlistId: null,
				watchlistSection: null,
			};

		default:
			return {
				...DEFAULT_STATE,
			};
	}
}
