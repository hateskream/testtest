import { z } from 'zod';
import { isBusinessDay, isUTCTimestamp, type Time, type UTCTimestamp } from 'lightweight-charts';

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

export function secondsToUtcSeconds(value: number): UtcSeconds {
	return value as UtcSeconds;
}

export function millisecondsToUtcMilliseconds(value: number): UtcMilliseconds {
	return value as UtcMilliseconds;
}

export function millisecondsToUtcSeconds(ms: number | UtcMilliseconds) {
	return Math.floor(ms / 1000) as UtcSeconds;
}

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
