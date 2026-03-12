import { z } from 'zod';

export const AnnualReturnsStatus = {
	Positive: 'positive',
	Negative: 'negative',
	Neutral: 'neutral',
} as const;

export const AnnualReturnsItemSchema = z.object({
	label: z.string(),
	value: z.number(),
	status: z.nativeEnum(AnnualReturnsStatus),
});

export type AnnualReturnsItem = z.infer<typeof AnnualReturnsItemSchema>;

export const AnnualReturnsDataSchema = z.object({
	summary: z.string(),
	status: z.nativeEnum(AnnualReturnsStatus),
	items: z.array(AnnualReturnsItemSchema),
});

export type AnnualReturnsData = z.infer<typeof AnnualReturnsDataSchema>;
