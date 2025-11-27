import type { CSSProperties } from 'vue';

import type { ICalendarEvent, IDailyCalendarInfoResponse, IEventBoardResponse, IWeeklyDayInfo } from '../models';
import { getStartOfWeek, isSameCalendarDay, isSameWeek } from '@/modules/calendar';

function localDateKey(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${dd}`;
}

export function toWeekDays(
	apiDays: IDailyCalendarInfoResponse[],
	baseDateSource: Date,
	locale: string,
	evBoard: IEventBoardResponse[] = [],
	favorites: string[],
): IWeeklyDayInfo[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const fmtShort = new Intl.DateTimeFormat(locale, { weekday: 'short' });
	const fmtLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });

	const apiMap = new Map<string, IDailyCalendarInfoResponse>();
	for (const item of apiDays) {
		const dt = new Date(item.date);
		apiMap.set(localDateKey(dt), item);
	}

	const eventsByDate = new Map<string, ICalendarEvent[]>();
	for (const d of evBoard) {
		eventsByDate.set(d.date, d.events);
	}

	const start = getStartOfWeek(baseDateSource);
	const currentWeek = isSameWeek(baseDateSource, today);

	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);

		const key = localDateKey(d);
		const hit = apiMap.get(key);
		const dayEvents = eventsByDate.get(key) ?? [];

		const isToday = isSameCalendarDay(d, today);

		// const now = new Date();
		// const hasSoon = isToday && dayEvents.some(ev => {
		// 	if (!ev.eventDatetime) {
		// 		return false;
		// 	}
		// 	const startAt = new Date(ev.eventDatetime);
		// 	const diff = startAt.getTime() - now.getTime();
		// 	return diff > 0 && diff <= 60 * 60 * 1000;
		// });

		const hasFavorite = dayEvents.some(ev => favorites.includes(ev.id));

		const colorDots: { color: CSSProperties['color'] }[] = [];

		if (isToday) {
			colorDots.push({ color: 'red' });
		}
		if (hasFavorite) {
			colorDots.push({ color: 'yellow' });
		}

		const metrics = hit ? [
			{ label: 'Economic', value: hit.metrics.economic },
			{ label: 'Earnings', value: hit.metrics.earnings },
			{ label: 'Dividends', value: hit.metrics.dividends },
		] : [
			{ label: 'Economic', value: 'N/A' } as const,
			{ label: 'Earnings', value: 'N/A' } as const,
			{ label: 'Dividends', value: 'N/A' } as const,
		];

		return {
			date: d,
			dayNumber: d.getDate(),
			weekdayShort: fmtShort.format(d),
			weekdayLong: fmtLong.format(d),
			isToday,
			isCurrentWeek: currentWeek,
			metrics,
			colorDots,
		};
	});
}
