import { type DateYYYYMMDD, EventType, Impact, MarketIds } from '@/modules/calendar';

export interface IEventBoardRange {
	from: DateYYYYMMDD;
	to: DateYYYYMMDD;
}

export interface IEventBoardFilters {
	marketId: MarketIds[];
	eventType: EventType[];
	impact: Impact[];
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

export interface ICalendarEventBadge {
	label: string;
	color: 'negative' | 'neutral' | 'positive';
}

export interface ICalendarEventDetails {
	label: string;
	link: string;
}

export interface ICalendarEvent {
	id: string;
	meta: {
		title: string;
		description: string;
		datetime: string;
		image: string;
		category: string;
		country: MarketIds;
		impact: Impact;
		badge?: ICalendarEventBadge;
	};
	canonical_ticker_id: string;
	metrics: ICalendarEventMetric[];
	details?: ICalendarEventDetails;
}

export interface IEventBoardResponse {
	date: string;
	events: ICalendarEvent[];
}
