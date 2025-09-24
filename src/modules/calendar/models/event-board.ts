import { type DateYYYYMMDD, EventType, Impact, MarketIds } from '@/modules/calendar';
import { SymbolType } from '@/modules/cell';

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

export interface IEventBoardRequestOptions {
	range: IEventBoardRange;
	filters: IEventBoardFilters;
}

export interface ICalendarEventMetric {
	label: string;
	value: string;
}

export interface ICalendarEvent {
	id: string;
	ticker: string;
	additional: string;
	symbolType: SymbolType;
	eventType: EventType;
	marketId: MarketIds;
	impact: Impact;
	eventTitle: string;
	eventTitleDescription?: string;
	eventDatetime?: string;
	eventSummary?: string;
	metrics: ICalendarEventMetric[];
	section: string;
	text?: string;
	link?: string;
	linkText?: string;
}

export interface IEventBoardResponse {
	date: string;
	events: ICalendarEvent[];
}
