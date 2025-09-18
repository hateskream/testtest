import { type DateYYYYMMDD, EventType, type IToolbarUserState } from '@/modules/calendar';

export interface ICreateEventBoardOptions {
	from: DateYYYYMMDD;
	to: DateYYYYMMDD;
	filters?: Partial<IToolbarUserState>;
}

export interface ICalendarEventMetric {
	label: string;
	value: string;
}

export interface ICalendarEvent {
	eventType: EventType;
	eventTitle: string;
	eventTitleDescription?: string;
	eventDatetime?: string;
	eventSummary?: string;
	metrics: ICalendarEventMetric[];
	ticker?: string;
	text?: string;
	link?: string;
	linkText?: string;
}

export interface IEventBoard {
	date: string;
	events: ICalendarEvent[];
}
