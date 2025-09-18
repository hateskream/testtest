import { EventType, Impact, MarketIds } from '@/modules/calendar/models';

export interface IToolbarUserState {
	marketId: MarketIds;
	eventType: EventType;
	impact: Impact;
	watchlist: {
		selectedId: string | null;
		selectedSectionId: string | null;
	};
}
