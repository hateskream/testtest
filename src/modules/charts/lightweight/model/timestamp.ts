import { isBusinessDay, isUTCTimestamp, type Time, type UTCTimestamp } from 'lightweight-charts';

import { isNumber } from '@/shared/lib';
import {
	getTimezoneOffsetInMinutes,
	millisecondsToUtcSeconds,
	secondsToUtcSeconds,
	type TimezoneUtcType,
	toUtcMilliseconds,
	type UtcMilliseconds,
	type UtcSeconds,
} from '../../common/model';

export function secondsToUTCTimestamp(seconds: UtcSeconds): UTCTimestamp {
	return seconds as unknown as UTCTimestamp;
}

export function UTCTimestampToSeconds(timestamp: UTCTimestamp): UtcSeconds {
	return timestamp as unknown as UtcSeconds;
}

export function millisecondsToUTCTimestamp(ms: UtcMilliseconds): UTCTimestamp {
	return Math.floor(ms / 1000) as UTCTimestamp;
}

export function UTCTimestampToMilliseconds(timestamp: UTCTimestamp): UtcMilliseconds {
	return timestamp * 1000 as unknown as UtcMilliseconds;
}

export function timeToUtcSeconds(time: Time): UtcSeconds {
	if (isUTCTimestamp(time)) {
		return UTCTimestampToSeconds(time);
	}

	if (isBusinessDay(time)) {
		return millisecondsToUtcSeconds(Date.UTC(time.year, time.month, time.day));
	}

	const [year, month, day] = time.split('-').map(v => parseInt(v));
	return millisecondsToUtcSeconds(Date.UTC(year, month, day));
}

export function timeToUtcMilliseconds(time: Time): UtcMilliseconds {
	if (isUTCTimestamp(time)) {
		return UTCTimestampToMilliseconds(time);
	}

	if (isBusinessDay(time)) {
		return Date.UTC(time.year, time.month, time.day) as UtcMilliseconds;
	}

	const [year, month, day] = time.split('-').map(v => parseInt(v));
	return Date.UTC(year, month, day) as UtcMilliseconds;
}

export function timeToDate(time: Time): Date {
	return new Date(timeToUtcMilliseconds(time));
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
