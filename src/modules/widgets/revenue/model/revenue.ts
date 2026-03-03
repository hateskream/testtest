import { z } from 'zod';

import type { ObjectEnum } from '@/shared/types';

export const RevenueMode = {
	Quarterly: 'quarterly',
	Yearly: 'yearly',
} as const;

export type RevenueModeType = ObjectEnum<typeof RevenueMode>;

export const RevenueModeSchema = z.nativeEnum(RevenueMode);

export const RevenueQuarterSchema = z.object({
	quarter: z.number(),
	value: z.number(),
	isEstimate: z.boolean(),
});

export type RevenueQuarter = z.infer<typeof RevenueQuarterSchema>;

export const RevenueYearQuarterlySchema = z.object({
	year: z.number(),
	quarters: z.array(RevenueQuarterSchema),
});

export type RevenueYearQuarterly = z.infer<typeof RevenueYearQuarterlySchema>;

export const RevenueQuarterlyHistorySchema = z.object({
	tickerId: z.string(),
	mode: z.literal(RevenueMode.Quarterly),
	years: z.array(RevenueYearQuarterlySchema),
});

export type RevenueQuarterlyHistory = z.infer<typeof RevenueQuarterlyHistorySchema>;

export const RevenueYearlyPointSchema = z.object({
	year: z.number(),
	value: z.number(),
	isEstimate: z.boolean(),
});

export type RevenueYearlyPoint = z.infer<typeof RevenueYearlyPointSchema>;

export const RevenueYearlyHistorySchema = z.object({
	tickerId: z.string(),
	mode: z.literal(RevenueMode.Yearly),
	years: z.array(RevenueYearlyPointSchema),
});

export type RevenueYearlyHistory = z.infer<typeof RevenueYearlyHistorySchema>;

export const RevenueHistorySchema = z.discriminatedUnion('mode', [
	RevenueQuarterlyHistorySchema,
	RevenueYearlyHistorySchema,
]);

export type RevenueHistory = z.infer<typeof RevenueHistorySchema>;

export const REVENUE_MODES = [
	RevenueMode.Quarterly,
	RevenueMode.Yearly,
] as const satisfies RevenueModeType[];
