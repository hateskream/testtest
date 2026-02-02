import { z } from 'zod';

export const DateRangePreset = {
	Day: '1D',
	Week: '1W',
	Month: '1M',
	SixMonths: '6M',
	Year: '1Y',
	All: 'ALL',
} as const;

export type DateRangePresetType = (typeof DateRangePreset)[keyof typeof DateRangePreset];

export const DateRangePresetValueSchema = z.object({
	type: z.literal('preset'),
	preset: z.nativeEnum(DateRangePreset),
});

export const DateRangeCustomValueSchema = z.object({
	type: z.literal('custom'),
	from: z.number(),
	to: z.number(),
});

export type DateRangePresetValue = { type: 'preset'; preset: DateRangePresetType };
export type DateRangeCustomValue = { type: 'custom'; from: number; to: number };

export const DateRangeValueSchema = z.discriminatedUnion('type', [
	DateRangePresetValueSchema,
	DateRangeCustomValueSchema,
]);

export type DateRangeValue = DateRangePresetValue | DateRangeCustomValue;

export function presetToDateRange(preset: DateRangePresetType) {
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
		case DateRangePreset.All:
			from.setFullYear(2000, 0, 1);
			break;
	}

	return { from: from.getTime(), to: now.getTime() };
}

export function toDateRange(value: DateRangeValue): { from: number; to: number } {
	if (value.type === 'preset') {
		return presetToDateRange(value.preset);
	}

	return { from: value.from, to: value.to };
}

export function createPreset(preset: DateRangePresetType) {
	return { type: 'preset', preset } as const;
}

export function isDateRangePreset(preset: string): preset is DateRangePresetType {
	return Object.values(DateRangePreset).includes(preset as DateRangePresetType);
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
	[DateRangePreset.All]: 'All',
} as const satisfies Record<DateRangePresetType, string>;

export function getDateRangePresetLabel(preset: DateRangePresetType) {
	return DateRangePresetToLabel[preset];
}

export const DateRangePresetToTitle = {
	[DateRangePreset.Day]: '1 day',
	[DateRangePreset.Week]: '1 week',
	[DateRangePreset.Month]: '1 month',
	[DateRangePreset.SixMonths]: '6 months',
	[DateRangePreset.Year]: '1 year',
	[DateRangePreset.All]: 'All time',
} as const satisfies Record<DateRangePresetType, string>;

export function getDateRangePresetTitle(preset: DateRangePresetType) {
	return DateRangePresetToTitle[preset];
}
