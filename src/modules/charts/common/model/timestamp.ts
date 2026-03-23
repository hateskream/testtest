import { z } from 'zod';

import { isNumber } from '@/shared/lib';
import { getTimezoneOffsetInMinutes, type TimezoneUtcType } from './timezone.ts';

const SEC_MIN = 0;
const SEC_MAX = 1e11;

export const UtcSecondsSchema = z.number()
	.int()
	.gte(SEC_MIN)
	.lte(SEC_MAX)
	.brand<'UtcSeconds'>();

export type UtcSeconds = z.infer<typeof UtcSecondsSchema>;

const MS_MIN = 0;
const MS_MAX = 1e14;

export const UtcMillisecondsSchema = z.number()
	.int()
	.gte(MS_MIN)
	.lte(MS_MAX)
	.brand<'UtcMilliseconds'>();

export type UtcMilliseconds = z.infer<typeof UtcMillisecondsSchema>;

export function isUtcSeconds(value: number): value is UtcSeconds {
	return UtcSecondsSchema.safeParse(value).success;
}

export function toUtcMilliseconds(value: UtcSeconds | UtcMilliseconds) {
	if (isUtcSeconds(value)) {
		return value * 1000 as UtcMilliseconds;
	}

	return value;
}

export function secondsToUtcSeconds(value: number): UtcSeconds {
	return value as UtcSeconds;
}

export function millisecondsToUtcMilliseconds(value: number): UtcMilliseconds {
	return value as UtcMilliseconds;
}

export function millisecondsToUtcSeconds(ms: number | UtcMilliseconds) {
	return Math.floor(ms / 1000) as UtcSeconds;
}

export function utcSecondsToString(seconds: UtcSeconds) {
	const date = new Date(seconds * 1000);

	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');

	return `${y}-${m}-${day}`;
}

export function dateStringToUtcSeconds(date: string) {
	const [year, month, day] = date.split('-').map(v => parseInt(v));
	return millisecondsToUtcSeconds(Date.UTC(year, month - 1, day));
}

export function toUtcStartOfDay(time: UtcSeconds | UtcMilliseconds) {
	const date = new Date(toUtcMilliseconds(time));
	date.setUTCHours(0, 0, 0, 0);

	return millisecondsToUtcSeconds(date.getTime());
}

export function toUtcEndOfDay(time: UtcSeconds | UtcMilliseconds) {
	const date = new Date(toUtcMilliseconds(time));
	date.setUTCHours(23, 59, 59, 999);

	return millisecondsToUtcSeconds(date.getTime());
}

export function strTimeToChartTime(time: string): UtcSeconds {
	const ms = Date.parse(time);
	return millisecondsToUtcSeconds(ms);
}

export function chartTimeToDate(time: number | string) {
	return new Date(isNumber(time) ? time * 1000 : time);
}

export function timeToZonedTime(time: string | number, timezone: TimezoneUtcType) {
	if (isNumber(time)) {
		const offset = getTimezoneOffsetInMinutes(timezone);
		return secondsToUtcSeconds(time + offset * 60);
	}

	return time;
}

export function zonedTimeToTime(zoned: UtcSeconds, timezone: TimezoneUtcType) {
	const offset = getTimezoneOffsetInMinutes(timezone);
	return secondsToUtcSeconds(zoned - offset * 60);
}
