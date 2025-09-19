import type { IDailyCalendarInfo, IWeeklyDayInfo } from '../types';
import { getStartOfWeek, isSameCalendarDay, isSameWeek } from '@/modules/calendar';

function localDateKey(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${dd}`;
}

export function toWeekDays(
	apiDays: IDailyCalendarInfo[],
	baseDateSource: Date,
	locale: string,
): IWeeklyDayInfo[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const fmtShort = new Intl.DateTimeFormat(locale, { weekday: 'short' });
	const fmtLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });

	const apiMap = new Map<string, IDailyCalendarInfo>();
	for (const item of apiDays) {
		const dt = new Date(item.date);
		apiMap.set(localDateKey(dt), item);
	}

	const start = getStartOfWeek(baseDateSource);
	const currentWeek = isSameWeek(baseDateSource, today);

	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);

		const hit = apiMap.get(localDateKey(d));
		const metrics = hit ? [
			{ label: 'Economic', value: hit.metrics.economic },
			{ label: 'Earnings', value: hit.metrics.earnings },
			{ label: 'Dividends', value: hit.metrics.dividends },
		] : [
			{ label: 'Economic', value: 'N/A' },
			{ label: 'Earnings', value: 'N/A' },
			{ label: 'Dividends', value: 'N/A' },
		];

		return {
			date: d,
			dayNumber: d.getDate(),
			weekdayShort: fmtShort.format(d),
			weekdayLong: fmtLong.format(d),
			isToday: isSameCalendarDay(d, today),
			isCurrentWeek: currentWeek,
			metrics,
			colorDots: [],
		} as IWeeklyDayInfo;
	});
}
