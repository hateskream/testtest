import type { DateYYYYMMDD } from '@/modules/calendar';

export function toUtcIsoDate(d: Date): DateYYYYMMDD {
	return (new Date(d.getTime() - d.getTimezoneOffset() * 60000)
		.toISOString()
		.split('T')[0]) as DateYYYYMMDD;
}

export function toIsoUtcDate(iso: DateYYYYMMDD) {
	const [y, m, d] = iso.split('-').map(Number);
	return new Date(y, (m || 1) - 1, d || 1);
}

export function getStartOfWeek(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = (day + 6) % 7;

	d.setDate(d.getDate() - diff);
	d.setHours(0, 0, 0, 0);

	return d;
}

export function getEndOfWeek(date: Date): Date {
	const start = getStartOfWeek(date);
	const d = new Date(start);

	d.setDate(start.getDate() + 6);
	d.setHours(23, 59, 59, 999);

	return d;
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
	return a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();
}

export function isSameWeek(a: Date, b: Date): boolean {
	const sa = getStartOfWeek(a);
	const sb = getStartOfWeek(b);

	return isSameCalendarDay(sa, sb);
}

export function addDays(d: Date, n: number): Date {
	const x = new Date(d);
	x.setUTCDate(x.getUTCDate() + n);
	return x;
}
