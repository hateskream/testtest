import {
	addDays as dfAddDays,
	parseISO,
	startOfWeek,
	endOfWeek,
	isSameDay,
	isSameWeek as dfIsSameWeek,
} from 'date-fns';

import type { DateYYYYMMDD } from '@/modules/calendar';

export function toUtcIsoDate(d: Date): DateYYYYMMDD {
	const y = d.getUTCFullYear();
	const m = String(d.getUTCMonth() + 1).padStart(2, '0');
	const day = String(d.getUTCDate()).padStart(2, '0');

	return `${y}-${m}-${day}` as DateYYYYMMDD;
}

export function toIsoUtcDate(iso: DateYYYYMMDD): Date {
	return parseISO(`${iso}T00:00:00Z`);
}

export function getStartOfWeek(date: Date): Date {
	return startOfWeek(date, {
		weekStartsOn: 1,
	});
}

export function getEndOfWeek(date: Date): Date {
	return endOfWeek(date, {
		weekStartsOn: 1,
	});
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
	return isSameDay(a, b);
}

export function isSameWeek(a: Date, b: Date): boolean {
	return dfIsSameWeek(a, b, {
		weekStartsOn: 1,
	});
}

export function addDays(d: Date, n: number): Date {
	return dfAddDays(d, n);
}


