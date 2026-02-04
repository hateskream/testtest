import { z } from 'zod';

import { millisecondsToUtcSeconds, type UtcMilliseconds, type UtcSeconds, UtcSecondsSchema } from './timestamp';

export const DateRangePreset = {
	Day: '1D',
	Week: '1W',
	Month: '1M',
	SixMonths: '6M',
	Year: '1Y',
	TenYears: '10Y',
	All: 'ALL',
} as const;

export type DateRangePresetType = (typeof DateRangePreset)[keyof typeof DateRangePreset];

const dateRangePresetList = Object.values(DateRangePreset);

export const DateRangePresetValueSchema = z.object({
	type: z.literal('preset'),
	preset: z.nativeEnum(DateRangePreset),
});

export const DateRangeCustomValueSchema = z.object({
	type: z.literal('custom'),
	from: UtcSecondsSchema,
	to: UtcSecondsSchema,
});

export type DateRangePresetValue = z.infer<typeof DateRangePresetValueSchema>;
export type DateRangeCustomValue = z.infer<typeof DateRangeCustomValueSchema>;

export type UtcRange<T extends UtcSeconds | UtcMilliseconds> = { from: T; to: T };

export const DateRangeValueSchema = z.discriminatedUnion('type', [
	DateRangePresetValueSchema,
	DateRangeCustomValueSchema,
]);

export type DateRangeValue = z.infer<typeof DateRangeValueSchema>;

export function presetToDateRange(preset: DateRangePresetType): UtcRange<UtcSeconds> {
	const now = new Date();
	const from = new Date();

	switch (preset) {
		case DateRangePreset.Day:
			from.setDate(now.getDate() - 1);
			break;
		case DateRangePreset.Week:
			from.setDate(now.getDate() - 7);
			break;
		case DateRangePreset.Month:
			from.setMonth(now.getMonth() - 1);
			break;
		case DateRangePreset.SixMonths:
			from.setMonth(now.getMonth() - 6);
			break;
		case DateRangePreset.Year:
			from.setFullYear(now.getFullYear() - 1);
			break;
		case DateRangePreset.TenYears:
			from.setFullYear(now.getFullYear() - 10);
			break;
		case DateRangePreset.All:
			from.setFullYear(2000, 0, 1);
			break;
	}

	return { from: millisecondsToUtcSeconds(from.getTime()), to: millisecondsToUtcSeconds(now.getTime()) };
}

export function toUtcSecondsRange(value: DateRangeValue): UtcRange<UtcSeconds> {
	if (value.type === 'preset') {
		return presetToDateRange(value.preset);
	}

	return { from: value.from, to: value.to };
}

export function createPreset<T extends DateRangePresetType>(preset: T) {
	return { type: 'preset', preset } as const;
}

export function isDateRangePreset(preset: string): preset is DateRangePresetType {
	return dateRangePresetList.includes(preset as DateRangePresetType);
}

export const DEFAULT_PRESETS = [
	createPreset(DateRangePreset.Day),
	createPreset(DateRangePreset.Week),
	createPreset(DateRangePreset.Month),
	createPreset(DateRangePreset.SixMonths),
	createPreset(DateRangePreset.Year),
	createPreset(DateRangePreset.All),
];

export const DateRangePresetToLabel = {
	[DateRangePreset.Day]: '1D',
	[DateRangePreset.Week]: '1W',
	[DateRangePreset.Month]: '1M',
	[DateRangePreset.SixMonths]: '6M',
	[DateRangePreset.Year]: '1Y',
	[DateRangePreset.TenYears]: '10Y',
	[DateRangePreset.All]: 'All',
} as const satisfies Record<DateRangePresetType, string>;

export function getDateRangePresetLabel<T extends DateRangePresetType>(preset: T) {
	return DateRangePresetToLabel[preset];
}

export const DateRangePresetToTitle = {
	[DateRangePreset.Day]: '1 day',
	[DateRangePreset.Week]: '1 week',
	[DateRangePreset.Month]: '1 month',
	[DateRangePreset.SixMonths]: '6 months',
	[DateRangePreset.Year]: '1 year',
	[DateRangePreset.TenYears]: '10 years',
	[DateRangePreset.All]: 'All time',
} as const satisfies Record<DateRangePresetType, string>;

export function getDateRangePresetTitle<T extends DateRangePresetType>(preset: T) {
	return DateRangePresetToTitle[preset];
}
