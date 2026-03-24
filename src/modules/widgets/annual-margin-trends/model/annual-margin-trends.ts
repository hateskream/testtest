import { z } from 'zod';

import type { ObjectEnum } from '@/shared/types';

export const MarginTrendStatus = {
	Positive: 'positive',
	Negative: 'negative',
	Neutral: 'neutral',
} as const;

export type MarginTrendStatusType = ObjectEnum<typeof MarginTrendStatus>;

export const MarginPointSchema = z.object({
	year: z.number(),
	value: z.number(),
});

export type MarginPoint = z.infer<typeof MarginPointSchema>;

export const MarginSeriesSchema = z.object({
	key: z.string(),
	label: z.string(),
	color: z.string(),
	backgroundColor: z.string(),
	isDashed: z.boolean(),
	currentValue: z.number(),
	points: z.array(MarginPointSchema),
});

export type MarginSeries = z.infer<typeof MarginSeriesSchema>;

export const AnnualMarginTrendsResponseSchema = z.object({
	tickerId: z.string(),
	summary: z.string(),
	status: z.nativeEnum(MarginTrendStatus),
	series: z.array(MarginSeriesSchema),
});

export type AnnualMarginTrendsResponse = z.infer<typeof AnnualMarginTrendsResponseSchema>;
