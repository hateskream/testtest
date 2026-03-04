import { isToday, isYesterday, isSameYear } from 'date-fns';

import { getDateFormatter } from '@/shared/lib';

export function formatNewsDate(dateTime: string | number | Date): string {
	const date = dateTime instanceof Date ? dateTime : new Date(dateTime);

	if (Number.isNaN(date.getTime())) {
		return '';
	}

	const now = new Date();

	const timeFormatter = getDateFormatter({
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	const time = timeFormatter.format(date);

	if (isToday(date)) {
		return time;
	}

	if (isYesterday(date)) {
		return `Yesterday, ${time}`;
	}

	if (isSameYear(date, now)) {
		const dateFormatter = getDateFormatter({
			day: 'numeric',
			month: 'short',
		});

		return `${dateFormatter.format(date)}, ${time}`;
	}

	const dateFormatter = getDateFormatter({
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});

	return `${dateFormatter.format(date)}, ${time}`;
}
