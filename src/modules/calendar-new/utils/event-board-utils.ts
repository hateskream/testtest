import { format, parseISO, differenceInMinutes } from 'date-fns';

import type { ICalendarEvent } from '../model/calendar';

const HOUR_MS = 60 * 60 * 1000;

export interface IGroupedEvents {
	hour: string;
	events: ICalendarEvent[];
}

export interface IHourStatus {
	soon: boolean;
	missed: boolean;
}

export function formatEventDay(dateStr: string, now: Date = new Date()): string {
	const date = parseISO(dateStr);

	if (Number.isNaN(date.getTime())) {
		return dateStr;
	}

	const sameYear = date.getUTCFullYear() === now.getUTCFullYear();
	const sameMonth = sameYear && date.getUTCMonth() === now.getUTCMonth();

	if (sameMonth) {
		return format(date, 'EEE d');
	}

	if (sameYear) {
		return format(date, 'MMMM, EEE d');
	}

	return format(date, 'MMMM yyyy, EEE d');
}

export function groupEventsByHour(events: ICalendarEvent[]): IGroupedEvents[] {
	const groups = new Map<string, ICalendarEvent[]>();

	for (const event of events) {
		if (!event.meta.datetime) {
			continue;
		}

		const hour = format(parseISO(event.meta.datetime), 'HH:mm');
		const group = groups.get(hour);

		if (group) {
			group.push(event);
		} else {
			groups.set(hour, [event]);
		}
	}

	return Array.from(groups.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([hour, groupEvents]) => ({ hour, events: groupEvents }));
}

export function getHourStatus(dayDate: string, hour: string, now: Date): IHourStatus {
	const [hh, mm = '0'] = hour.split(':');
	const date = parseISO(dayDate);
	date.setHours(Number(hh), Number(mm), 0, 0);

	const diff = date.getTime() - now.getTime();

	return {
		soon: diff > 0 && diff <= HOUR_MS,
		missed: diff <= 0,
	};
}

export function getRelativeLabel(datetime: string, now: Date): string | null {
	const date = parseISO(datetime);
	const mins = differenceInMinutes(date, now);

	if (mins > 0 && mins < 60) {
		return `in ${mins} min${mins === 1 ? '' : 's'}`;
	}

	return null;
}

export function findNextEventTime(events: ICalendarEvent[], now: Date): Date | null {
	const nowTime = now.getTime();

	for (const event of events) {
		const eventTime = parseISO(event.meta.datetime).getTime();
		if (eventTime > nowTime) {
			return new Date(eventTime);
		}
	}

	return null;
}
