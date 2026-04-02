import { z } from 'zod';

import { MarketType } from '@/modules/market';
import { ActivityMetricsSentimentSchema } from './sentiment';

const BaseActivityMetricsSchema = z.object({
	tickerId: z.string(),
});

export const CryptoActivityMetricsSchema = BaseActivityMetricsSchema.extend({
	marketType: z.literal(MarketType.Crypto),
	marketCap: z.string(),
	volume24h: z.string(),
	fdv: z.string(),
	volToMktCap24h: z.string(),
	totalSupply: z.string(),
	sentiment: ActivityMetricsSentimentSchema,
});

export type CryptoActivityMetrics = z.infer<typeof CryptoActivityMetricsSchema>;

export const StockActivityMetricsSchema = BaseActivityMetricsSchema.extend({
	marketType: z.literal(MarketType.Stock),
	marketCap: z.string(),
	volume24h: z.string(),
	totalReturn3m: z.string(),
	totalReturn1y: z.string(),
	forwardPe: z.string(),
	sector: z.string(),
});

export type StockActivityMetrics = z.infer<typeof StockActivityMetricsSchema>;

export const IndexActivityMetricsSchema = BaseActivityMetricsSchema.extend({
	marketType: z.literal(MarketType.Indices),
	volume24h: z.string(),
	sector: z.string().optional(),
});

export type IndexActivityMetrics = z.infer<typeof IndexActivityMetricsSchema>;

export const ForexActivityMetricsSchema = BaseActivityMetricsSchema.extend({
	marketType: z.literal(MarketType.Forex),
	volume24h: z.string(),
});

export type ForexActivityMetrics = z.infer<typeof ForexActivityMetricsSchema>;

export const CommodityActivityMetricsSchema = BaseActivityMetricsSchema.extend({
	marketType: z.literal(MarketType.Commodities),
	volume24h: z.string(),
});

export type CommodityActivityMetrics = z.infer<typeof CommodityActivityMetricsSchema>;

export const EtfActivityMetricsSchema = BaseActivityMetricsSchema.extend({
	marketType: z.literal(MarketType.Etf),
	marketCap: z.string(),
	avgVolume: z.string(),
	beta: z.string(),
	topHolding: z.string().optional(),
	numSectors: z.string(),
});

export type EtfActivityMetrics = z.infer<typeof EtfActivityMetricsSchema>;

export const ActivityMetricsSchema = z.discriminatedUnion('marketType', [
	CryptoActivityMetricsSchema,
	StockActivityMetricsSchema,
	IndexActivityMetricsSchema,
	CommodityActivityMetricsSchema,
	ForexActivityMetricsSchema,
	EtfActivityMetricsSchema,
]);

export type ActivityMetrics = z.infer<typeof ActivityMetricsSchema>;
