import { EventType, Impact, markets } from '@/modules/calendar/constants';

export interface IToolbarUserState {
	market: typeof markets[number];
	eventType: EventType;
	impact: Impact;
}
