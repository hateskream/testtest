import { EventType, Impact, MarketIds } from '@/modules/calendar';

export interface IToolbarState {
	marketId: MarketIds;
	impact: Impact;
	eventType: EventType;
	watchlistId: string | null;
	watchlistSection: string | null;
}
