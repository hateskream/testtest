import { z } from 'zod';

import {
	createPreset,
	DateRangePreset,
	type DateRangePresetType,
	type DateRangePresetValue,
} from '@/modules/lightweight-charts/model';
import type { ObjectEnum } from '@/shared/types';

export const CpiDateRangePreset = {
	Year: DateRangePreset.Year,
	ThreeYears: DateRangePreset.ThreeYears,
	FiveYears: DateRangePreset.FiveYears,
	TenYears: DateRangePreset.TenYears,
	All: DateRangePreset.All,
} as const satisfies Record<string, DateRangePresetType>;

export const CpiDateRangePresetSchema = z.nativeEnum(CpiDateRangePreset);

export type CpiDateRangePresetType = ObjectEnum<typeof CpiDateRangePreset>;

export const CpiValueType = {
	Points: 'points',
	ChangeDelta: 'change-delta',
	ChangePercent: 'change-percent',
} as const;

export const CpiValueTypeSchema = z.nativeEnum(CpiValueType);

export type CpiValueTypeType = ObjectEnum<typeof CpiValueType>;

export const CpiHistoryPointSchema = z.object({
	label: z.string(),
	history: z.number(),
});

export type CpiHistoryPoint = z.infer<typeof CpiHistoryPointSchema>;

export const CpiHistorySchema = z.object({
	range: CpiDateRangePresetSchema,
	growthYoy: z.number(),
	points: z.array(CpiHistoryPointSchema),
});

export type CpiHistory = z.infer<typeof CpiHistorySchema>;


export const CPI_DATE_RANGE_PRESETS = [
	createPreset(CpiDateRangePreset.Year),
	createPreset(CpiDateRangePreset.ThreeYears),
	createPreset(CpiDateRangePreset.FiveYears),
	createPreset(CpiDateRangePreset.TenYears),
	createPreset(CpiDateRangePreset.All),
] as const satisfies DateRangePresetValue[];
