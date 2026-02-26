import { z } from 'zod';


export const AnalystRatingsSummary = {
	Optimistic: 'optimistic',
	Pessimistic: 'pessimistic',
	Neutral: 'neutral',
} as const;

const BaseAnalystRatingsSchema = z.object({
	tickerId: z.string(),
	strongBuy: z.number(),
	buy: z.number(),
	neutral: z.number(),
	sell: z.number(),
	strongSell: z.number(),
	summary: z.nativeEnum(AnalystRatingsSummary),
});


export const AnalystRatingsSchema = BaseAnalystRatingsSchema;

export type AnalystRatings = z.infer<typeof AnalystRatingsSchema>;


