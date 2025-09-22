import { type DateYYYYMMDD, EventType, Impact, MarketIds } from '@/modules/calendar';

export interface IEventBoardRange {
	from: DateYYYYMMDD;
	to: DateYYYYMMDD;
}

export interface IEventBoardFilters {
	marketId: MarketIds;
	eventType: EventType;
	impact: Impact;
	watchlist: string[];
}

export interface ICreateEventBoardOptions {
	range: IEventBoardRange;
	filters: IEventBoardFilters;
}

export interface ICalendarEventMetric {
	label: string;
	value: string;
}

export interface ICalendarEvent {
	eventType: EventType;
	marketId: MarketIds;
	impact: Impact;
	eventTitle: string;
	eventTitleDescription?: string;
	eventDatetime?: string;
	eventSummary?: string;
	metrics: ICalendarEventMetric[];
	section: string;
	ticker: string;
	text?: string;
	link?: string;
	linkText?: string;
}

export interface IEventBoard {
	date: string;
	events: ICalendarEvent[];
}
