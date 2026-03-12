import { z } from 'zod';

export const PriceToEarningsStatus = {
	Positive: 'positive',
	Negative: 'negative',
	Neutral: 'neutral',
} as const;

export const PriceToEarningsItemSchema = z.object({
	label: z.string(),
	value: z.number(),
	max: z.number(),
});

export type PriceToEarningsItem = z.infer<typeof PriceToEarningsItemSchema>;

export const PriceToEarningsDataSchema = z.object({
	summary: z.string(),
	status: z.nativeEnum(PriceToEarningsStatus),
	items: z.array(PriceToEarningsItemSchema),
});

export type PriceToEarningsData = z.infer<typeof PriceToEarningsDataSchema>;
