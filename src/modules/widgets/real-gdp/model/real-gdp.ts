import { z } from 'zod';

import { DateRangePreset, type DateRangePresetType } from '@/modules/lightweight-charts/model';
import type { ObjectEnum } from '@/shared/types';

export const REAL_GDP_METRIC = 'real';

export const RealGdpDateRangePreset = {
	FiveYears: DateRangePreset.FiveYears,
	TenYears: DateRangePreset.TenYears,
	TwentyFiveYears: DateRangePreset.TwentyFiveYears,
	All: DateRangePreset.All,
} as const satisfies Record<string, DateRangePresetType>;

export const RealGdpDateRangePresetSchema = z.nativeEnum(RealGdpDateRangePreset);

export type RealGdpDateRangePresetType = ObjectEnum<typeof RealGdpDateRangePreset>;

export const RealGdpValueType = {
	Points: 'points',
	ChangeDelta: 'change-delta',
	ChangePercent: 'change-percent',
} as const;

export const RealGdpValueTypeSchema = z.nativeEnum(RealGdpValueType);

export type RealGdpValueTypeType = ObjectEnum<typeof RealGdpValueType>;

export interface IRealGdpHistoryPoint {
	label: string;
	history: number;
}

export interface IRealGdpHistory {
	range: RealGdpDateRangePresetType;
	points: IRealGdpHistoryPoint[];
}

export const REAL_GDP_DATE_RANGE_PRESETS = [
	RealGdpDateRangePreset.FiveYears,
	RealGdpDateRangePreset.TenYears,
	RealGdpDateRangePreset.TwentyFiveYears,
	RealGdpDateRangePreset.All,
] as const satisfies RealGdpDateRangePresetType[];

export function calculateGrowthYoy(points: IRealGdpHistoryPoint[]) {
	const [firstPoint, lastPoint] =
		[points[points.length - 2], points[points.length - 1]];

	return (lastPoint.history - firstPoint.history) / lastPoint.history * 100;
}
