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

	const sameYear = date.getFullYear() === now.getFullYear();
	const sameMonth = sameYear && date.getMonth() === now.getMonth();

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

export function toUTCMidnightUnix(date: Date): number {
	const d = new Date(date);
	d.setUTCHours(0, 0, 0, 1);
	return Math.floor(d.getTime() / 1000);
}

export function localDateToUTCUnix(date: Date): number {
	return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000;
}

export function toUTCEndOfDayUnix(date: Date): number {
	const d = new Date(date);
	d.setUTCHours(23, 59, 59, 999);
	return Math.floor(d.getTime() / 1000);
}

export function formatUTCDate(date: Date): string {
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, '0');
	const d = String(date.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function getUTCWeekRange(date: Date): { from: number; to: number } {
	const d = new Date(date);
	const utcDay = d.getUTCDay();
	const offset = (utcDay + 6) % 7;

	const monday = new Date(d);
	monday.setUTCDate(d.getUTCDate() - offset);

	const sunday = new Date(d);
	sunday.setUTCDate(d.getUTCDate() + (6 - offset));

	return {
		from: toUTCMidnightUnix(monday),
		to: toUTCMidnightUnix(sunday),
	};
}
