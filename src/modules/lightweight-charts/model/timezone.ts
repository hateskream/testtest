import { z } from 'zod';

import { cacheStringFunction } from '@/shared/lib/cache-string-function.ts';

export const TimezoneUtc = {
	UTCm12: 'UTC-12',
	UTCm11: 'UTC-11',
	UTCm10: 'UTC-10',
	UTCm930: 'UTC-9_30',
	UTCm9: 'UTC-9',
	UTCm8: 'UTC-8',
	UTCm7: 'UTC-7',
	UTCm6: 'UTC-6',
	UTCm5: 'UTC-5',
	UTCm4: 'UTC-4',
	UTCm330: 'UTC-3_30',
	UTCm3: 'UTC-3',
	UTCm2: 'UTC-2',
	UTCm1: 'UTC-1',
	UTC0: 'UTC0',
	UTCp1: 'UTC1',
	UTCp2: 'UTC2',
	UTCp3: 'UTC3',
	UTCp330: 'UTC3_30',
	UTCp4: 'UTC4',
	UTCp430: 'UTC4_30',
	UTCp5: 'UTC5',
	UTCp530: 'UTC5_30',
	UTCp545: 'UTC5_45',
	UTCp6: 'UTC6',
	UTCp630: 'UTC6_30',
	UTCp7: 'UTC7',
	UTCp8: 'UTC8',
	UTCp845: 'UTC8_30',
	UTCp9: 'UTC9',
	UTCp930: 'UTC9_30',
	UTCp10: 'UTC10',
	UTCp1030: 'UTC10_30',
	UTCp11: 'UTC11',
	UTCp12: 'UTC12',
	UTCp1245: 'UTC12_45',
	UTCp13: 'UTC13',
	UTCp14: 'UTC14',
} as const;

export type TimezoneUtcType = typeof TimezoneUtc[keyof typeof TimezoneUtc];

export const TimezoneUtcSchema = z.nativeEnum(TimezoneUtc);

export const timezoneUtcToDisplay = {
	[TimezoneUtc.UTCm12]: 'UTC-12',
	[TimezoneUtc.UTCm11]: 'UTC-11',
	[TimezoneUtc.UTCm10]: 'UTC-10',
	[TimezoneUtc.UTCm930]: 'UTC-9:30',
	[TimezoneUtc.UTCm9]: 'UTC-9',
	[TimezoneUtc.UTCm8]: 'UTC-8',
	[TimezoneUtc.UTCm7]: 'UTC-7',
	[TimezoneUtc.UTCm6]: 'UTC-6',
	[TimezoneUtc.UTCm5]: 'UTC-5',
	[TimezoneUtc.UTCm4]: 'UTC-4',
	[TimezoneUtc.UTCm330]: 'UTC-3:30',
	[TimezoneUtc.UTCm3]: 'UTC-3',
	[TimezoneUtc.UTCm2]: 'UTC-2',
	[TimezoneUtc.UTCm1]: 'UTC-1',
	[TimezoneUtc.UTC0]: 'UTC+0',
	[TimezoneUtc.UTCp1]: 'UTC+1',
	[TimezoneUtc.UTCp2]: 'UTC+2',
	[TimezoneUtc.UTCp3]: 'UTC+3',
	[TimezoneUtc.UTCp330]: 'UTC+3:30',
	[TimezoneUtc.UTCp4]: 'UTC+4',
	[TimezoneUtc.UTCp430]: 'UTC+4:30',
	[TimezoneUtc.UTCp5]: 'UTC+5',
	[TimezoneUtc.UTCp530]: 'UTC+5:30',
	[TimezoneUtc.UTCp545]: 'UTC+5:45',
	[TimezoneUtc.UTCp6]: 'UTC+6',
	[TimezoneUtc.UTCp630]: 'UTC+6:30',
	[TimezoneUtc.UTCp7]: 'UTC+7',
	[TimezoneUtc.UTCp8]: 'UTC+8',
	[TimezoneUtc.UTCp845]: 'UTC+8:45',
	[TimezoneUtc.UTCp9]: 'UTC+9',
	[TimezoneUtc.UTCp930]: 'UTC+9:30',
	[TimezoneUtc.UTCp10]: 'UTC+10',
	[TimezoneUtc.UTCp1030]: 'UTC+10:30',
	[TimezoneUtc.UTCp11]: 'UTC+11',
	[TimezoneUtc.UTCp12]: 'UTC+12',
	[TimezoneUtc.UTCp1245]: 'UTC+12:45',
	[TimezoneUtc.UTCp13]: 'UTC+13',
	[TimezoneUtc.UTCp14]: 'UTC+14',
} as const satisfies Record<TimezoneUtcType, string>;

export function getTimezoneUtcLabel(timezone: TimezoneUtcType) {
	return timezoneUtcToDisplay[timezone];
}

export const timeZoneUtcFilters = Object.entries(timezoneUtcToDisplay).map(([key, value]) => ({
	value: key as TimezoneUtcType,
	label: value,
}));

export const getTimezoneOffset = cacheStringFunction((timezone: TimezoneUtcType) => {
	return timezone.replace('UTC', '').replace('_', ':');
});

export const getTimezoneOffsetInMinutes = cacheStringFunction((timezone: TimezoneUtcType) => {
	const raw = timezone.replace('UTC', '');
	const sign = raw[1] === '-' ? -1 : 1;
	const [hours, minutes = 0] = raw.split('_').map(Number);

	return sign * (hours * 60 + minutes);
});

export type TimezoneIntl = string;

export function timezoneUtcToIntl(timezone: TimezoneUtcType): TimezoneIntl {
	const numericOffset = getTimezoneOffset(timezone);

	const isNegative = numericOffset.startsWith('-');

	if (numericOffset.includes(':')) {
		if (isNegative) {
			if (numericOffset.length === 5) {
				return `-0${numericOffset.slice(1)}`;
			}

			return numericOffset;
		}

		if (numericOffset.length === 4) {
			return `+0${numericOffset}`;
		}

		return numericOffset;
	}

	if (isNegative) {
		if (numericOffset.length === 2) {
			return `-0${numericOffset.slice(1)}`;
		}

		return numericOffset;
	}

	if (numericOffset.length === 1) {
		return `+0${numericOffset}`;
	}

	return `+${numericOffset}`;
}


