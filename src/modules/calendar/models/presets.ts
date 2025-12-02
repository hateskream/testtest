import { EventType, Impact, MarketIds } from '@/modules/calendar';
import type { ToolbarSchemaType } from '@/modules/calendar/services/schema.ts';

const ALL_IMPACTS = [Impact.Low, Impact.Medium, Impact.High];
const ALL_EVENT_TYPES = [
	EventType.Economic,
	EventType.Earnings,
	EventType.Revenue,
	EventType.Dividends,
	EventType.Splits,
	EventType.Ipos,
	EventType.Crypto,
	EventType.News,
	EventType.Conference,
];
const ALL_MARKETS = [
	MarketIds.USA,
	MarketIds.India,
	MarketIds.Germany,
	MarketIds.Japan,
	MarketIds.Canada,
	MarketIds.HongKong,
	MarketIds.UnitedKingdom,
];


export const DEFAULT_STATE: ToolbarSchemaType = {
	marketId: ALL_MARKETS,
	impact: ALL_IMPACTS,
	eventType: ALL_EVENT_TYPES,
	watchlistId: null,
	watchlistSection: null,
};

export function getDefaultState(defaultState?: string): ToolbarSchemaType {
	switch (defaultState) {
		case 'all':
			return {
				marketId: ALL_MARKETS,
				impact: ALL_IMPACTS,
				eventType: ALL_EVENT_TYPES,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'stock':
			return {
				marketId: [MarketIds.USA],
				impact: ALL_IMPACTS,
				eventType: [
					EventType.Economic,
					EventType.Earnings,
					EventType.Revenue,
					EventType.Dividends,
					EventType.Splits,
					EventType.Ipos,
					EventType.Crypto,
				],
				watchlistId: null,
				watchlistSection: null,
			};

		case 'forex':
			return {
				marketId: ALL_MARKETS,
				impact: [],
				eventType: [
					EventType.Economic,
					EventType.Earnings,
				],
				watchlistId: null,
				watchlistSection: null,
			};

		case 'high-impact':
			return {
				marketId: ALL_MARKETS,
				impact: [Impact.High],
				eventType: ALL_EVENT_TYPES,
				watchlistId: null,
				watchlistSection: null,
			};

		case 'usa-earnings':
			return {
				marketId: [MarketIds.USA],
				impact: ALL_IMPACTS,
				eventType: [EventType.Earnings],
				watchlistId: null,
				watchlistSection: null,
			};

		case 'crypto':
			return {
				marketId: ALL_MARKETS,
				impact: ALL_IMPACTS,
				eventType: [EventType.Crypto],
				watchlistId: null,
				watchlistSection: null,
			};

		case 'dividends-europe':
			return {
				marketId: [MarketIds.Germany],
				impact: ALL_IMPACTS,
				eventType: [EventType.Dividends],
				watchlistId: null,
				watchlistSection: null,
			};

		case 'earnings-week':
			return {
				marketId: ALL_MARKETS,
				impact: [Impact.Medium],
				eventType: [EventType.Earnings],
				watchlistId: null,
				watchlistSection: null,
			};

		case 'popular':
			return {
				marketId: [MarketIds.USA],
				impact: [Impact.High],
				eventType: [EventType.Earnings],
				watchlistId: null,
				watchlistSection: null,
			};

		case 'economic':
			return {
				marketId: ALL_MARKETS,
				impact: [Impact.Medium],
				eventType: [EventType.Economic],
				watchlistId: null,
				watchlistSection: null,
			};

		default:
			return {
				...DEFAULT_STATE,
			};
	}
}
