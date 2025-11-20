export function toTime(dateTime: number | Date, timezoneOffset?: string) {
	const date = typeof dateTime === 'number' ? new Date(dateTime) : dateTime;
	return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZone: timezoneOffset });
}

export function getTimezoneOffset(): string {
	const offsetMinutes = new Date().getTimezoneOffset();

	const offsetHours = -offsetMinutes / 60;
	const sign = offsetHours >= 0 ? '+' : '-';

	return `${sign}${Math.abs(offsetHours)}`;
}
