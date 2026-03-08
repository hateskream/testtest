import { z } from 'zod';

export const HOLDINGS_TOP_HOLDERS_GROUP_KEY = 'holdings';

export const AddressesByHoldingsSegmentSchema = z.object({
	key: z.string(),
	label: z.string(),
	percentage: z.number(),
	color: z.string(),
});

export const AddressesByHoldingsSchema = z.object({
	tickerId: z.string(),
	groupBy: z.literal(HOLDINGS_TOP_HOLDERS_GROUP_KEY),
	segments: z.array(AddressesByHoldingsSegmentSchema).nonempty(),
});

export type AddressesByHoldingsSegment = z.infer<typeof AddressesByHoldingsSegmentSchema>;
export type AddressesByHoldings = z.infer<typeof AddressesByHoldingsSchema>;
