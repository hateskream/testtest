import { z } from 'zod';

import type { ObjectEnum } from '@/shared/types';

export const ChangeDirection = {
	Up: 'up',
	Down: 'down',
	Neutral: 'neutral',
} as const;

export type ChangeDirectionType = ObjectEnum<typeof ChangeDirection>;

export const EpsQuarterStatus = {
	Beat: 'beat',
	Missed: 'missed',
} as const;

export type EpsQuarterStatusType = ObjectEnum<typeof EpsQuarterStatus>;

export const EpsForecastSchema = z.object({
	changePercent: z.number(),
	direction: z.nativeEnum(ChangeDirection),
});

export type EpsForecast = z.infer<typeof EpsForecastSchema>;

export const EpsQuarterSchema = z.object({
	year: z.number(),
	quarter: z.number(),
	estimatedEps: z.number().nullable(),
	actualEps: z.number().nullable(),
	estimatedRevenue: z.number().nullable(),
	actualRevenue: z.number().nullable(),
	status: z.nativeEnum(EpsQuarterStatus).nullable(),
});

export type EpsQuarter = z.infer<typeof EpsQuarterSchema>;

export const EarningsPerShareDataSchema = z.object({
	tickerId: z.string(),
	forecast: EpsForecastSchema,
	quarters: z.array(EpsQuarterSchema),
});

export type EarningsPerShareData = z.infer<typeof EarningsPerShareDataSchema>;

export function formatQuarterLabel(year: number, quarter: number) {
	return `Q${quarter} ${year}`;
}
