import { z } from 'zod';

export const SeasonalPointSchema = z.object({
	timestamp: z.string(),
	price: z.number(),
	changePct: z.number(),
});

export type SeasonalPoint = z.infer<typeof SeasonalPointSchema>;

export const SeasonalSeriesSchema = z.object({
	year: z.number(),
	color: z.string(),
	ytdChangePct: z.number(),
	points: z.array(SeasonalPointSchema),
});

export type SeasonalSeries = z.infer<typeof SeasonalSeriesSchema>;

export const SeasonalsResponseSchema = z.object({
	tickerId: z.string(),
	currency: z.string(),
	series: z.array(SeasonalSeriesSchema),
});

export type SeasonalsResponse = z.infer<typeof SeasonalsResponseSchema>;
