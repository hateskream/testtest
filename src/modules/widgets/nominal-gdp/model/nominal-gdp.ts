import { z } from 'zod';

import { DateRangePreset, type DateRangePresetType } from '@/modules/lightweight-charts/model';
import type { ObjectEnum } from '@/shared/types';

export const NOMINAL_GDP_METRIC = 'nominal';

export const NominalGdpDateRangePreset = {
	FiveYears: DateRangePreset.FiveYears,
	TenYears: DateRangePreset.TenYears,
	TwentyFiveYears: DateRangePreset.TwentyFiveYears,
	All: DateRangePreset.All,
} as const satisfies Record<string, DateRangePresetType>;

export const NominalGdpDateRangePresetSchema = z.nativeEnum(NominalGdpDateRangePreset);

export type NominalGdpDateRangePresetType = ObjectEnum<typeof NominalGdpDateRangePreset>;

export const NominalGdpHistoryPointSchema = z.object({
	label: z.string(),
	history: z.number(),
	forecast: z.number(),
});

export type NominalGdpHistoryPoint = z.infer<typeof NominalGdpHistoryPointSchema>;

export const NominalGdpHistorySchema = z.object({
	range: NominalGdpDateRangePresetSchema,
	points: z.array(NominalGdpHistoryPointSchema),
});

export type NominalGdpHistory = z.infer<typeof NominalGdpHistorySchema>;

export const NOMINAL_GDP_DATE_RANGE_PRESETS = [
	NominalGdpDateRangePreset.FiveYears,
	NominalGdpDateRangePreset.TenYears,
	NominalGdpDateRangePreset.TwentyFiveYears,
	NominalGdpDateRangePreset.All,
] as const satisfies NominalGdpDateRangePresetType[];

export function calculateGrowthYoy(points: NominalGdpHistoryPoint[]) {
	const firstNominalPointIndex = points.findIndex(point => point.history === 0);

	const lastRealNominalPointIndex = firstNominalPointIndex === -1
		? points.length - 1
		: firstNominalPointIndex - 1;

	const [firstPoint, lastPoint] =
		[points[lastRealNominalPointIndex - 1], points[lastRealNominalPointIndex]];

	return (lastPoint.history - firstPoint.history) / lastPoint.history * 100;
}
