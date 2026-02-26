import { z } from 'zod';

export const PriceCandleSchema = z.object({
	close: z.number(),
	high: z.number(),
	low: z.number(),
	open: z.number(),
});

export const ChartPriceHistoryPointSchema = z.object({
	changePercent: z.number(),
	delta: z.number(),
	marketCap: z.string(),
	timestamp: z.string(),
	volume: z.string(),
	priceCandle: PriceCandleSchema,
});

export type ChartPriceHistoryPoint = z.infer<typeof ChartPriceHistoryPointSchema>;

export const ChartPriceCurrentDataSchema = z.object({
	price: z.number(),
	changePercent: z.number(),
	delta: z.number(),
	prevClosePrice: z.number(),
	updatedAt: z.string(),
});

export type ChartPriceCurrentData = z.infer<typeof ChartPriceCurrentDataSchema>;

export const ChartPriceHistoryDataSchema = z.object({
	current: ChartPriceCurrentDataSchema,
	points: z.array(ChartPriceHistoryPointSchema),
});

export type ChartPriceHistoryData = z.infer<typeof ChartPriceHistoryDataSchema>;
