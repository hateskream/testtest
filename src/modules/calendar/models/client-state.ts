import { EventType, Impact, MarketIds } from '@/modules/calendar';

export interface IToolbarState {
	marketId: Set<MarketIds>;
	impact: Set<Impact>;
	eventType: Set<EventType>;
	watchlistId: string | null;
	watchlistSection: string | null;
}
