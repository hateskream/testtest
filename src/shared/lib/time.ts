import { getDateFormatter } from './date-formatter';

export function toTime(dateTime: number | Date, timezoneOffset?: string) {
	const date = typeof dateTime === 'number' ? new Date(dateTime) : dateTime;

	const formatter = getDateFormatter({ hour: '2-digit', minute: '2-digit', timeZone: timezoneOffset });

	return formatter.format(date);
}

export function getTimezoneOffset(): string {
	const offsetMinutes = new Date().getTimezoneOffset();

	const offsetHours = -offsetMinutes / 60;
	const sign = offsetHours >= 0 ? '+' : '-';

	return `${sign}${Math.abs(offsetHours)}`;
}
