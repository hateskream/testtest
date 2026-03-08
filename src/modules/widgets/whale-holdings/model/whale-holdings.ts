import { z } from 'zod';

export const WHALES_TOP_HOLDERS_GROUP_KEY = 'whales';

export const WhaleHoldingsSegmentSchema = z.object({
	key: z.string(),
	label: z.string(),
	percentage: z.number(),
	color: z.string(),
});

export const WhaleHoldingsSchema = z.object({
	tickerId: z.string(),
	groupBy: z.literal(WHALES_TOP_HOLDERS_GROUP_KEY),
	segments: z.array(WhaleHoldingsSegmentSchema).nonempty(),
});

export type WhaleHoldingsSegment = z.infer<typeof WhaleHoldingsSegmentSchema>;
export type WhaleHoldings = z.infer<typeof WhaleHoldingsSchema>;
