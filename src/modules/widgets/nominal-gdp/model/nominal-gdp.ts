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

export interface INominalGdpHistoryPoint {
	label: string;
	history: number;
	forecast: number;
}

export interface INominalGdpHistory {
	range: NominalGdpDateRangePresetType;
	points: INominalGdpHistoryPoint[];
}

export const NOMINAL_GDP_DATE_RANGE_PRESETS = [
	NominalGdpDateRangePreset.FiveYears,
	NominalGdpDateRangePreset.TenYears,
	NominalGdpDateRangePreset.TwentyFiveYears,
	NominalGdpDateRangePreset.All,
] as const satisfies NominalGdpDateRangePresetType[];

export function calculateGrowthYoy(points: INominalGdpHistoryPoint[]) {
	const firstNominalPointIndex = points.findIndex(point => point.history === 0);

	const lastRealNominalPointIndex = firstNominalPointIndex === -1
		? points.length - 1
		: firstNominalPointIndex - 1;

	const [firstPoint, lastPoint] =
		[points[lastRealNominalPointIndex - 1], points[lastRealNominalPointIndex]];

	return (lastPoint.history - firstPoint.history) / lastPoint.history * 100;
}
