import { EventType, Impact, markets } from '@/modules/calendar/models';

export interface IToolbarUserState {
	market: typeof markets[number];
	eventType: EventType;
	impact: Impact;
	watchlist: {
		selectedId: string | null;
		selectedSectionId: string | null;
	};
}
